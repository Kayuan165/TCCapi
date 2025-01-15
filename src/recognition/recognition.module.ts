import { Module } from '@nestjs/common';
import { RecognitionController } from './recognition.controller';
import { RecognitionService } from './recognition.service';
import { RecognitionGateway } from './gateway/recognition.gateway';

@Module({
  controllers: [RecognitionController],
  providers: [RecognitionService, RecognitionGateway],
})
export class RecognitionModule {}
