import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { IsNull, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  }

  async registerAttendance(rg: string): Promise<{
    message: string;
    attendance: Attendance;
    formattedEntryTime?: string;
    formattedExitTime?: string;
  }> {
    const user = await this.userRepo.findOne({ where: { rg } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verifica se existe registro de entrada sem saída
    const activeAttendance = await this.attendanceRepo.findOne({
      where: { user: { id: user.id }, exitTime: IsNull() },
      order: { entryTime: 'DESC' },
    });

    if (activeAttendance) {
      // Registra saída
      activeAttendance.exitTime = new Date();
      await this.attendanceRepo.save(activeAttendance);

      return {
        message: 'Saída registrada com sucesso',
        attendance: activeAttendance,
        formattedEntryTime: this.formatTime(activeAttendance.entryTime),
        formattedExitTime: this.formatTime(activeAttendance.exitTime),
      };
    }

    // Cria novo registro de entrada
    const newAttendance = this.attendanceRepo.create({
      user,
      entryTime: new Date(),
    });

    const savedAttendance = await this.attendanceRepo.save(newAttendance);

    return {
      message: 'Entrada registrada com sucesso',
      attendance: savedAttendance,
      formattedEntryTime: this.formatTime(savedAttendance.entryTime),
    };
  }

  async getAllAttendances(): Promise<Attendance[]> {
    const attendances = await this.attendanceRepo.find({
      relations: ['user'],
      order: { entryTime: 'DESC' },
    });

    // Adiciona horários formatados para cada registro
    return attendances.map((attendance) => ({
      ...attendance,
      formattedEntryTime: this.formatTime(attendance.entryTime),
      formattedExitTime: attendance.exitTime
        ? this.formatTime(attendance.exitTime)
        : null,
    }));
  }

  async getAttendancesByType(
    type: 'visitor' | 'resident',
  ): Promise<Attendance[]> {
    const attendances = await this.attendanceRepo.find({
      relations: ['user'],
      where: { user: { type } },
      order: { entryTime: 'DESC' },
    });

    // Adiciona horários formatados para cada registro
    return attendances.map((attendance) => ({
      ...attendance,
      formattedEntryTime: this.formatTime(attendance.entryTime),
      formattedExitTime: attendance.exitTime
        ? this.formatTime(attendance.exitTime)
        : null,
    }));
  }
}
