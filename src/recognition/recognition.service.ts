import { Injectable } from '@nestjs/common';
import { RecognitionGateway } from './gateway/recognition.gateway';

@Injectable()
export class RecognitionService {
  constructor(private readonly recognitionGateway: RecognitionGateway) {}

  async processRecognition(data: any) {
    this.recognitionGateway.sendToClient(data);
  }
}
