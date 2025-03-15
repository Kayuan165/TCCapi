import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';
import { AttendanceService } from 'src/attendance/attendance.service';

@WebSocketGateway({ cors: true })
export class RecognitionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly attendandeService: AttendanceService) {}

  handleConnection(client: any) {
    console.log('Cliente conectado', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Cliente desconectado', client.id);
  }

  @SubscribeMessage('recognized')
  async handleRecognized(client: any, payload: { userId: number }) {
    try {
      const attendance = await this.attendandeService.registerEntry(
        payload.userId,
      );
      this.server.emit('newAttendance', attendance);
    } catch (error) {
      client.emit('error', error.message);
    }
  }
}
