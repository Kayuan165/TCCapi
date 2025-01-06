import { Attendance } from 'src/attendance/entities/attendance.entity';
import { User } from 'src/user/entities/user.entity';
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '1234',
  database: 'TCCSystem',
  entities: [User, Attendance],
  migrations: ['src/user/migrations/*.{ts,js}'],
  logging: true,
});

export default AppDataSource;
