import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resident } from './entities/resident.entity';
import { Repository } from 'typeorm';
import { CreateResidentDto } from './dto/create-resident.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateResidentDto } from './dto/update-resident.dto';

@Injectable()
export class ResidentService {
  constructor(
    @InjectRepository(Resident)
    private readonly repo: Repository<Resident>,
  ) {}

  public async create(
    createResidentDto: CreateResidentDto,
  ): Promise<CreateResidentDto> {
    const resident = this.repo.create(createResidentDto);

    const dbResident = await this.repo.save(resident);

    return plainToInstance(CreateResidentDto, dbResident);
  }

  public async findAll(): Promise<CreateResidentDto[]> {
    const residents = await this.repo.find();

    return plainToInstance(CreateResidentDto, residents);
  }

  public async findOne(id: number): Promise<CreateResidentDto> {
    const resident = await this.repo.findOne({ where: { id } });

    return plainToInstance(CreateResidentDto, resident);
  }

  public async update(
    id: number,
    updateResidentDto: Partial<UpdateResidentDto>,
    file?: Express.Multer.File,
  ): Promise<Resident> {
    const resident = await this.repo.findOne({ where: { id } });

    if (!resident) {
      throw new Error('Morador não encontrado');
    }

    if (updateResidentDto.email && updateResidentDto.email !== resident.email) {
      const residentExists = await this.repo.findOne({
        where: { email: updateResidentDto.email },
      });
      if (residentExists && residentExists.id !== resident.id) {
        throw new Error('Email já cadastrado');
      }
    }

    if (updateResidentDto.rg && updateResidentDto.rg !== resident.rg) {
      const residentExists = await this.repo.findOne({
        where: { rg: updateResidentDto.rg },
      });
      if (residentExists && residentExists.id !== resident.id) {
        throw new Error('RG já cadastrado');
      }
    }

    const updateFields: Partial<Resident> = {
      ...(updateResidentDto.name ? { name: updateResidentDto.name } : {}),
      ...(updateResidentDto.email ? { email: updateResidentDto.email } : {}),
      ...(updateResidentDto.rg ? { rg: updateResidentDto.rg } : {}),
      ...(updateResidentDto.address
        ? { address: updateResidentDto.address }
        : {}),
      ...(updateResidentDto.phone ? { phone: updateResidentDto.phone } : {}),
      ...(file ? { photo_path: `uploads/${file.filename}` } : {}),
      updated_at: new Date(),
    };

    if (Object.keys(updateFields).length > 0) {
      await this.repo.update({ id }, updateFields);
    }

    return this.repo.findOne({ where: { id } });
  }

  public async remove(id: number): Promise<CreateResidentDto> {
    const resident = await this.repo.findOne({ where: { id } });

    if (!resident) {
      throw new Error('Morador não encontrado');
    }

    await this.repo.delete({ id });

    return plainToInstance(CreateResidentDto, resident);
  }

  public async uploadFile(id: number, photo_path: string): Promise<Resident> {
    const resident = await this.repo.findOne({ where: { id } });

    if (!resident) {
      throw new Error('Morador não encontrado');
    }

    resident.photo_path = photo_path;
    return this.repo.save(resident);
  }
}
