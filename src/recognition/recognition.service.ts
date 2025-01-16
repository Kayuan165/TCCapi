import { Injectable, Logger } from '@nestjs/common';
import { RecognitionGateway } from './gateway/recognition.gateway';
import { RecognizedDto } from './dto/recognition.dto';
import { Server } from 'http';

@Injectable()
export class RecognitionService {
  private readonly logger = new Logger(RecognitionService.name);
  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  constructor(private readonly recognitionGateway: RecognitionGateway) {}

  async processRecognition(data: RecognizedDto): Promise<void> {
    try {
      this.logger.log('Recebendo dados de reconhecimento facial...', data);

      if (!data.name || !data.rg || !data.photo_path) {
        throw new Error(
          'Dados incompletos. Certifique-se de enviar "name", "rg" e "photo_path".',
        );
      }

      this.recognitionGateway.sendToClient(data);

      this.logger.log('Dados de reconhecimento facial enviados com sucesso.');
    } catch (error) {
      this.logger.error(
        'Erro ao processar os dados de reconhecimento facial.',
        error.stack,
      );
      throw error;
    }
  }
}
