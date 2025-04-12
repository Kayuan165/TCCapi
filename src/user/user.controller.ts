import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FaceTrainingService } from 'src/face-training/face-training.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly faceTrainingService: FaceTrainingService,
  ) {}

  @Post('init-training')
  async initTraining(@Body() body: { rg: string }) {
    try {
      if (!body.rg) {
        throw new BadRequestException('RG é obrigatório');
      }
      return await this.userService.startFaceTraining(body.rg);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao iniciar treinamento');
    }
  }

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUserAfterTraining(createUserDto);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  @Get('training-status/:rg')
  async getTrainingStatus(@Param('rg') rg: string) {
    try {
      if (!rg) {
        throw new BadRequestException('RG é obrigatório');
      }
      return await this.faceTrainingService.getTrainingStatus(rg);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao verificar status');
    }
  }

  @Get('resident')
  findAllResident() {
    return this.userService.findAllResident();
  }

  @Get('visitors')
  findAllVisitors() {
    return this.userService.findAllVisitors();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.userService.findOne(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(+id, updateUserDto);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    try {
      return await this.userService.remove(+id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover usuário');
    }
  }
}
