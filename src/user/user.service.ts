import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { FaceTrainingService } from '../face-training/face-training.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    private readonly faceTrainingService: FaceTrainingService,
  ) {}

  async startFaceTraining(rg: string) {
    const exists = await this.repo.findOne({ where: { rg } });
    if (exists) throw new ConflictException('RG já cadastrado');

    return this.faceTrainingService.startTraining({ rg });
  }

  async createUserAfterTraining(createUserDto: CreateUserDto) {
    await this.faceTrainingService.verifyTrainingCompletion(createUserDto.rg);

    if (!createUserDto.name || !createUserDto.email || !createUserDto.type) {
      throw new BadRequestException('Dados incompletos para cadastro');
    }

    const user = this.repo.create(createUserDto);
    const dbUser = await this.repo.save(user);
    return plainToInstance(CreateUserDto, dbUser);
  }

  public async findAllResident(): Promise<CreateUserDto[]> {
    const users = await this.repo.find({ where: { type: 'resident' } });
    return plainToInstance(CreateUserDto, users);
  }

  public async findAllVisitors(): Promise<CreateUserDto[]> {
    const users = await this.repo.find({ where: { type: 'visitor' } });
    return plainToInstance(CreateUserDto, users);
  }

  public async findOne(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return plainToInstance(CreateUserDto, user);
  }

  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const exists = await this.repo.findOne({
        where: { email: updateUserDto.email },
      });
      if (exists) throw new ConflictException('E-mail já está em uso');
    }

    if (updateUserDto.rg && updateUserDto.rg !== user.rg) {
      const exists = await this.repo.findOne({
        where: { rg: updateUserDto.rg },
      });
      if (exists) throw new ConflictException('RG já está em uso');
    }

    await this.repo.update(id, {
      ...updateUserDto,
      updated_at: new Date(),
    });

    return this.repo.findOne({ where: { id } });
  }

  public async remove(id: number): Promise<CreateUserDto> {
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    await this.repo.remove(user);
    return plainToInstance(CreateUserDto, user);
  }
}
