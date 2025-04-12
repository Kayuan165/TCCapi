export class StartTrainingDto {
  readonly trainingId: number;
  readonly rg: string;
  readonly name: string;
  readonly email: string;
  readonly type: 'visitor' | 'resident';
}
