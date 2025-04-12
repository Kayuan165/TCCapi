import { Body, Controller, Post } from '@nestjs/common';
import { FaceTrainingService } from './face-training.service';

@Controller('face-training')
export class FaceTrainingController {
  constructor(private readonly faceTrainingService: FaceTrainingService) {}

  @Post('callback')
  async handleCallback(
    @Body() body: { trainingId: string; rg: string; success: boolean },
  ) {
    await this.faceTrainingService.handleCallback(body);
    return { success: true };
  }
}
