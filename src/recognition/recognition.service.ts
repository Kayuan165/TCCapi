import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { RecognitionGateway } from './gateway/recognition.gateway';
import { RecognizedDto } from './dto/recognition.dto';
import { AttendanceService } from 'src/attendance/attendance.service';

@Injectable()
export class RecognitionService {
  private readonly logger = new Logger(RecognitionService.name);

  constructor(
    @Inject(forwardRef(() => RecognitionGateway))
    private readonly recognitionGateway: RecognitionGateway,
    @Inject(forwardRef(() => AttendanceService))
    private readonly attendanceService: AttendanceService,
  ) {}

  async processRecognition(data: RecognizedDto): Promise<void> {
    try {
      this.logger.log('Recebendo dados de reconhecimento facial...', data);

      if (!data.name || !data.photo_path || !data.rg) {
        throw new Error('Dados incompletos');
      }

      const user = await this.attendanceService.findUserByRg(data.rg);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      const attendance = await this.attendanceService.registerEntry(user.id);

      this.recognitionGateway.server.emit('visitorRecognized', attendance);
    } catch (error) {
      this.logger.error(
        'Erro ao processar os dados do reconhecimento facial',
        error.stack,
      );
      throw error;
    }
  }
}
