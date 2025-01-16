import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { RecognizedDto } from './dto/recognition.dto';
import { RecognitionService } from './recognition.service';

@Controller('api')
export class RecognitionController {
  constructor(private readonly recognitionService: RecognitionService) {}

  @Post('recognized')
  async hadleRecognition(@Body() recognizedDto: RecognizedDto) {
    try {
      await this.recognitionService.processRecognition(recognizedDto);

      return { message: 'Dados processados recebidos com sucesso' };
    } catch (error) {
      throw new HttpException(
        {
          message: 'Erro ao processar dados recebidos',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
