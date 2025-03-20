import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ResidentService } from './resident.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
@Controller('resident')
export class ResidentController {
  constructor(private readonly residentService: ResidentService) {}

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
  create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    if (!body.name || !body.rg || !body.email || !body.address || !body.phone) {
      throw new Error('Nome, RG, Email, Endereço e Telefone são obrigatórios');
    }

    const createResidentDto: CreateResidentDto = {
      ...body,
      photo_path: file ? `uploads/${file.filename}` : null,
    };
    return this.residentService.create(createResidentDto);
  }

  @Get()
  findAll() {
    return this.residentService.findAll();
  }

  @Get(':id')
  findOne(id: number) {
    return this.residentService.findOne(id);
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
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateResidentDto: UpdateResidentDto,
  ) {
    if (file) {
      updateResidentDto.photo_path = `uploads/${file.filename}`;
    }
    return this.residentService.update(+id, updateResidentDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.residentService.remove(+id);
  }
}
