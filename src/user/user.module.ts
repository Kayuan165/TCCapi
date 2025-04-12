import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FaceTrainingModule } from 'src/face-training/face-training.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FaceTrainingModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
