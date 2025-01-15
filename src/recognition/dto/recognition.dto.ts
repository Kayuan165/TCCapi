import { IsNotEmpty, IsString } from 'class-validator';

export class RecognizedDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  rg: string;

  @IsNotEmpty()
  @IsString()
  photo_path: string;
}
