import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 15, unique: true, nullable: false })
  rg: string;

  @Column({ nullable: true })
  address?: string; //  moradores

  @Column({ nullable: true })
  phone?: string; //  moradores

  @Column({ type: 'enum', enum: ['visitor', 'resident'], default: 'visitor' })
  type: 'visitor' | 'resident';

  @Column({ length: 100, nullable: false })
  photo_path: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];
}
