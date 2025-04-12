import { Test, TestingModule } from '@nestjs/testing';
import { FaceTrainingService } from './face-training.service';

describe('FaceTrainingService', () => {
  let service: FaceTrainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FaceTrainingService],
    }).compile();

    service = module.get<FaceTrainingService>(FaceTrainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
