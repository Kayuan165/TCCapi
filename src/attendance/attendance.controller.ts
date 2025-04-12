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

  @Post('register')
  async registerAttendance(@Body('rg') rg: string) {
    if (!rg) {
      throw new HttpException('O RG é obrigatório', HttpStatus.BAD_REQUEST);
    }
    return this.attendanceService.registerAttendance(rg);
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
