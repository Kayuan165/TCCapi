import { forwardRef, Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { RecognitionGateway } from './gateway/recognition.gateway';
import { AttendanceModule } from 'src/attendance/attendance.module';

@Module({
  imports: [forwardRef(() => AttendanceModule)],
  controllers: [RecognitionController],
  providers: [RecognitionService, RecognitionGateway],
  exports: [RecognitionService],
})
export class RecognitionModule {}
