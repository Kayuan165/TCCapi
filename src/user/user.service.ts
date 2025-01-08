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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.repo.update(id, updateUserDto);
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
}
