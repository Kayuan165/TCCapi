import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { IsNull, Repository } from 'typeorm';
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

      this.recognitionGateway.server.emit('visitorRecognized', lastAttendance);
      return lastAttendance;
    }

    const newAttendance = this.attendanceRepo.create({
      user,
      entryTime: new Date(),
    });

    const savedAttendance = await this.attendanceRepo.save(newAttendance);

    this.recognitionGateway.server.emit('visitorRecognized', savedAttendance);

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

    this.recognitionGateway.server.emit('userExit', attendance);

    return attendance;
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
