import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'http';

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

  sendToClient(data: any) {
    this.server.emit('recognition', data);
  }
}
