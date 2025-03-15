import { Controller, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('recognition')
  async recognizedUser(@Body('userId') userId: number) {
    return this.attendanceService.registerEntry(userId);
  }
}
