import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FaceTrainingService } from './face-training.service';
import { FaceTrainingController } from './face-training.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingLog } from './entities/training-log.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([TrainingLog])],
  providers: [FaceTrainingService],
  controllers: [FaceTrainingController],
  exports: [FaceTrainingService],
})
export class FaceTrainingModule {}
