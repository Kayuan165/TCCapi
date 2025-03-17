import { Controller, Post, Body, Get } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('entry')
  async recognizedUser(@Body('userId') userId: number) {
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
}
