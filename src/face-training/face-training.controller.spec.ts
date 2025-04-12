import { Test, TestingModule } from '@nestjs/testing';
import { FaceTrainingController } from './face-training.controller';

describe('FaceTrainingController', () => {
  let controller: FaceTrainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FaceTrainingController],
    }).compile();

    controller = module.get<FaceTrainingController>(FaceTrainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
