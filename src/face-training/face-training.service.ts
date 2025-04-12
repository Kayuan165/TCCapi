import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainingLog } from './entities/training-log.entity';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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

    // Simula o callback após 2 segundos
    setTimeout(() => {
      this.handleCallback({
        rg: data.rg,
        success: true,
      });
    }, 2000);

    return { trainingId: log.id, status: 'started' };

    try {
      await firstValueFrom(
        this.httpService.post('http://python-service/train', {
          rg: data.rg,
          callbackUrl: `/face-training/callback/${log.id}`,
        }),
      );
      return { trainingId: log.id, status: 'started' };
    } catch (error) {
      await this.trainingLogRepository.update(log.id, { status: 'failed' });
      this.logger.error(
        `Falha no treinamento para RG: ${data.rg}`,
        error.stack,
      );
      throw new Error('Falha ao iniciar treinamento');
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
    if (!callbackData.rg) {
      throw new Error('RG é obrigatório no callback');
    }

    await this.trainingLogRepository.update(
      {
        rg: callbackData.rg,
        status: 'pending',
      },
      {
        status: callbackData.success ? 'completed' : 'failed',
        completedAt: new Date(),
      },
    );
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
