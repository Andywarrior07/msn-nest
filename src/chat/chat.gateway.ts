import { NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import {
  SubscribeMessage,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UsersService } from '../users/services/users.service';
import { IamService } from '../iam/services/iam.service';
import { ChatService } from './services/chat.service';
import { Message } from './schemas/message.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    private readonly chatService: ChatService,
    private readonly iamService: IamService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  // @SubscribeMessage('message')
  // handleMessage(client: Socket, payload: any): void {
  //   console.log({ payload });
  //   this.server.emit('recMessage', payload);
  // }

  // @SubscribeMessage('join-room')
  // handleJoinRoom(client: Socket, room: string) {
  //   client.join(room);
  // }

  // @SubscribeMessage('leave-room')
  // handleLeaveRoom(client: Socket, room: string) {
  //   client.leave(room);
  // }

  // @SubscribeMessage('chat')
  // handleChatMessage(client: Socket, data: { message: string; room: string }) {
  //   console.log({ data });
  //   this.server
  //     .to(data.room)
  //     .emit('chat', { message: data.message, sender: client.id });
  // }

  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() _id: string,
  ) {
    const userExists = await this.usersService.getUserById(_id);
    console.log(userExists);
    if (!userExists) {
      console.log('unidentified user');
      return client.disconnect();
      // TODO: Probar ambos casos
      // throw new NotAcceptableException('Unidentified user');
    }

    client.join(_id);
    client['_id'] = _id;
    this.server.to(_id).emit('userJoined', _id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message,
  ) {
    const { accessToken } = client.handshake.auth;
    const { sub } = this.iamService.decodeToken(accessToken);

    if (!sub) {
      throw new UnauthorizedException();
    }

    const newMessage = await this.chatService.saveMessage(message);

    this.server.to(newMessage.to).emit('sendMessage', newMessage);
    this.server.to(newMessage.from).emit('sendMessage', newMessage);
    // const conversationId = this.chatService.getConversationId(sender, receiver);
    // await this.chatService.saveMessage(conversationId, sender, message);

    // Se emite el evento solo a los usuarios que están en la sala de chat correspondiente
    // this.server.to(sender).to(receiver).emit('newMessage', { sender, message });
  }

  async handleConnection(client: Socket, ...args: any[]) {
    // TODO: Validar con el jwt el usuario
    const { accessToken } = client.handshake.auth;
    const { sub } = this.iamService.decodeToken(accessToken);

    if (!sub) {
      throw new UnauthorizedException();
    }

    // const { friends } = await this.usersService.getUserById(sub);

    client.join(sub);

    // TODO: Para decir que un usuario, o mostrar, esta online
    // for (let friend of friends) {
    //   this.server.to(friend._id.toString()).emit('user-list', { userId: sub });
    // }
    // TODO: Como emitir a todos los usuarios - friends que estoy conectado
    // this.server.to(friendId1).to(friendId2).emit('users-list') o en un ciclo for

    console.log(`Connected client id: ${client.id}`);
  }
}
