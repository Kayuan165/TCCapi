import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingLog } from './entities/training-log.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FaceTrainingService {
  private readonly logger = new Logger(FaceTrainingService.name);

  constructor(
    @InjectRepository(TrainingLog)
    private readonly trainingLogRepository: Repository<TrainingLog>,
    private readonly httpService: HttpService,
  ) {}

  async startTraining(data: { rg: string }) {
    const log = this.trainingLogRepository.create({
      rg: data.rg,
      status: 'pending',
    });
    await this.trainingLogRepository.save(log);

    try {
      this.httpService
        .post('http://localhost:5000/coletar', {
          rg: data.rg,
          callbackUrl: `http://localhost:3000/face-training/callback`,
        })
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          error: (err) => {
            this.trainingLogRepository
              .update({ id: log.id, status: 'pending' }, { status: 'failed' })
              .catch((e) => console.error('Falha ao atualizar status:', e));
          },
        });

      return {
        trainingId: log.id,
        status: 'pending',
        message: 'Solicitação de treinamento recebida com sucesso',
      };
    } catch (error) {
      await this.trainingLogRepository.update(log.id, { status: 'failed' });
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Falha ao iniciar treinamento',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyTrainingCompletion(rg: string) {
    const log = await this.trainingLogRepository.findOne({
      where: { rg, status: 'completed' },
      order: { createdAt: 'DESC' },
    });

    if (!log) {
      throw new Error('Treinamento não concluído para este RG');
    }
    return true;
  }

  async handleCallback(callbackData: { rg: string; success: boolean }) {
    const result = await this.trainingLogRepository.update(
      { rg: callbackData.rg, status: 'pending' },
      {
        status: callbackData.success ? 'completed' : 'failed',
        completedAt: new Date(),
      },
    );

    if (result.affected === 0) {
      throw new NotFoundException('Registro de treinamento não encontrado');
    }

    return { success: true };
  }

  async getTrainingStatus(rg: string) {
    const log = await this.trainingLogRepository.findOne({
      where: { rg },
      order: { createdAt: 'DESC' },
    });
    return {
      status: log?.status || 'not_found',
      ready: log?.status === 'completed',
    };
  }
}
