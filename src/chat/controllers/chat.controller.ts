import { Body, Controller, Get, Query } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { Message } from '../schemas/message.schema';
import { MessagesDto } from '../dtos/messages.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly service: ChatService) {}

  @Get('/messages')
  async getMessages(@Query() messagesDto: MessagesDto): Promise<Message[]> {
    return this.service.getAllMessages(messagesDto);
  }
}
