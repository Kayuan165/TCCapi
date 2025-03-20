import { Module } from '@nestjs/common';
import { ResidentService } from './resident.service';
import { ResidentController } from './resident.controller';
import { Resident } from './entities/resident.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Resident])],
  providers: [ResidentService],
  controllers: [ResidentController],
  exports: [ResidentService],
})
export class ResidentModule {}
