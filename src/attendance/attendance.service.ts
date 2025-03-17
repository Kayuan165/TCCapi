import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { RecognitionGateway } from 'src/recognition/gateway/recognition.gateway';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(forwardRef(() => RecognitionGateway))
    private readonly recognitionGateway: RecognitionGateway,
  ) {}

  async registerEntry(userId: number): Promise<Attendance> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const existingAttendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, exitTime: null },
    });

    if (existingAttendance) {
      throw new Error('Usuário já está registrado');
    }

    const newAttendance = this.attendanceRepo.create({
      user,
      entryTime: new Date(),
    });
    const savedAttendance = await this.attendanceRepo.save(newAttendance);

    this.recognitionGateway.server.emit('visitorReconized', savedAttendance);

    return savedAttendance;
  }

  async registerExit(userId: number): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { user: { id: userId }, exitTime: null },
      order: { entryTime: 'DESC' },
    });

    if (!attendance) {
      throw new Error('Nenhum regustro de entrada encontrado');
    }

    attendance.exitTime = new Date();
    const upadateAttendance = await this.attendanceRepo.save(attendance);

    this.recognitionGateway.notifyExit(userId);

    return upadateAttendance;
  }

  async getAllAttendances(): Promise<Attendance[]> {
    return this.attendanceRepo.find({
      relations: ['user'],
      order: { entryTime: 'DESC' },
    });
  }

  async findUserByRg(rg: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { rg } });
  }
}
