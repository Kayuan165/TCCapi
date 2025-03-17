import { forwardRef, Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { RecognitionModule } from 'src/recognition/recognition.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from 'src/user/entities/user.entity';
import { RecognitionGateway } from 'src/recognition/gateway/recognition.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    TypeOrmModule.forFeature([User]),
    forwardRef(() => RecognitionModule),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, RecognitionGateway],
  exports: [AttendanceService],
})
export class AttendanceModule {}
