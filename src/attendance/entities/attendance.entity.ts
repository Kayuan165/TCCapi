import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  entryTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  exitTime: Date;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.attendances, { onDelete: 'CASCADE' })
  user: User;
}
