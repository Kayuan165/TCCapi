import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log(body);

    const parsedBody = JSON.parse(JSON.stringify(body));

    if (
      !parsedBody.name ||
      !parsedBody.rg ||
      !parsedBody.email ||
      !parsedBody.type
    ) {
      throw new BadRequestException('Nome, RG, Email e Tipo são obrigatórios');
    }

    if (!['visitor', 'resident'].includes(body.type)) {
      throw new BadRequestException(
        "O campo 'type' deve ser 'visitor' ou 'resident'",
      );
    }

    const createUserDto: CreateUserDto = {
      ...parsedBody,
      photo_path: file ? `uploads/${file.filename}` : null,
    };

    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Este E-mail ou RG já estão cadastrados');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('update/:id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          callback(null, uniqueName);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (file) {
      updateUserDto.photo_path = `uploads/${file.filename}`;
    }

    return this.userService.update(+id, updateUserDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
