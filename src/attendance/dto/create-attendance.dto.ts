import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsNotEmpty()
  @IsDateString()
  entryTime: string;

  @IsDateString()
  @IsNotEmpty()
  exitTime: string;
}
