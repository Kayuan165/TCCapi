import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async registerEntry(userId: number): Promise<Attendance> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const activeAttendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, exitTime: IsNull() },
    });

    if (activeAttendance) {
      throw new BadRequestException('Usuário já está dentro do condomínio');
    }

    const lastAttendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, exitTime: IsNull() },
      order: { entryTime: 'DESC' },
    });

    if (lastAttendance) {
      lastAttendance.entryTime = new Date();
      lastAttendance.exitTime = null;

      await this.attendanceRepo.save(lastAttendance);

      return lastAttendance;
    }

    const newAttendance = this.attendanceRepo.create({
      user,
      entryTime: new Date(),
    });

    const savedAttendance = await this.attendanceRepo.save(newAttendance);

    return savedAttendance;
  }

  async registerExit(userId: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, exitTime: IsNull() },
      order: { entryTime: 'DESC' },
    });

    if (!attendance) {
      throw new BadRequestException('Nenhum registro de entrada encontrado');
    }

    attendance.exitTime = new Date();
    await this.attendanceRepo.save(attendance);

    return attendance;
  }

  async getAllAttendances(): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      relations: ['user'],
      order: { entryTime: 'DESC' },
    });
  }

  async getAttendancesByType(
    type: 'visitor' | 'resident',
  ): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      relations: ['user'],
      where: { user: { type } },
      order: { entryTime: 'DESC' },
    });
  }
}
