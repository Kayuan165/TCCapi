import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Attendance } from './attendance/entities/attendance.entity';
import { RecognitionController } from './src/recognition/recognition.controller';
import { RecognitionController } from './recognition/recognition.controller';
import { RecognitionService } from './recognition/recognition.service';
@Module({
  imports: [
    UserModule,
    AttendanceModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '1234',
      database: 'TCCSystem',
      entities: [User, Attendance],
      synchronize: true,
      logging: true,
    }),
  ],
  controllers: [AppController, RecognitionController],
  providers: [AppService, RecognitionService],
})
export class AppModule {}
