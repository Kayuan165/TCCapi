import {
  Controller,
  Post,
  Body,
  Get,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('entry')
  async recognizedUser(@Body('userId') userId: number) {
    if (!userId) {
      throw new HttpException(
        'O ID do usuário é obrigatório',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.attendanceService.registerEntry(userId);
  }

  @Post('exit')
  async registerExit(@Body('userId') userId: number) {
    return this.attendanceService.registerExit(userId);
  }

  @Get('all')
  async getAllAttendances() {
    return this.attendanceService.getAllAttendances();
  }

  @Get()
  async getAttendancesByType(@Query('type') type: 'visitor' | 'resident') {
    if (!type || !['visitor', 'resident'].includes(type)) {
      throw new HttpException(
        'Tipo de usuário inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.attendanceService.getAttendancesByType(type);
  }
}
