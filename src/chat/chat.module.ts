import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { UsersModule } from '../users/users.module';
import { IamModule } from '../iam/iam.module';
import { Message, MessageSchema } from './schemas/message.schema';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';

@Module({
  controllers: [ChatController],
  imports: [
    IamModule,
    UsersModule,
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
