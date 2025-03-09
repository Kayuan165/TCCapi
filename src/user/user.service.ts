import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  public users: User[];
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const user = this.repo.create(createUserDto);
    const dbUser = await this.repo.save(user);

    return plainToInstance(CreateUserDto, dbUser);
  }

  public async findAll(): Promise<CreateUserDto[]> {
    const users = await this.repo.find();
    return plainToInstance(CreateUserDto, users);
  }

  public async findOne(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOne({ where: { id } });
    return plainToInstance(CreateUserDto, user);
  }

  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
    file?: Express.Multer.File,
  ): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) {
      throw new Error(`O usuário não foi encontrado.`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const userExists = await this.repo.findOne({
        where: { email: updateUserDto.email },
      });
      if (userExists && userExists.id !== id) {
        throw new Error('Já existe um usuário com esse email.');
      }
    }

    if (updateUserDto.rg && updateUserDto.rg !== user.rg) {
      const userExists = await this.repo.findOne({
        where: { rg: updateUserDto.rg },
      });
      if (userExists && userExists.id !== id) {
        throw new Error('Já existe um usuário com esse RG.');
      }
    }

    const updatedFields: Partial<User> = {
      ...(updateUserDto.name ? { name: updateUserDto.name } : {}),
      ...(updateUserDto.email ? { email: updateUserDto.email } : {}),
      ...(updateUserDto.rg ? { rg: updateUserDto.rg } : {}),
      ...(file ? { photo_path: `uploads/${file.filename}` } : {}),
      updated_at: new Date(),
    };

    if (Object.keys(updatedFields).length > 0) {
      await this.repo.update({ id }, updatedFields);
    }

    return this.repo.findOne({ where: { id } });
  }

  public async remove(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new Error(`O usuário não foi encontrado.`);
    }
    await this.repo.remove(user);
    return plainToInstance(CreateUserDto, user);
  }

  public async uploadFile(id: number, photoPath: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new Error(`O usuário não foi encontrado.`);
    }
    user.photo_path = photoPath;
    return this.repo.save(user);
  }
}
