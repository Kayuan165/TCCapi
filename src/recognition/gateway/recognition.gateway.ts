import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

@WebSocketGateway({ cors: true })
export class RecognitionGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: any) {
    console.log('Cliente conectado', client.id);
  }

  handleDisconnect(client: any) {
    console.log('Cliente desconectado', client.id);
  }

  sendToClient(data: any): void {
    if (this.server) {
      this.server.emit('recognized', data);
    } else {
      throw new Error('Servidor não inicializado');
    }
  }
}
