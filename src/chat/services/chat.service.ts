import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../schemas/message.schema';
import { MessageData } from '../interfaces/message.interface';
import { MessagesDto } from '../dtos/messages.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async getAllMessages({ to, from }: MessagesDto): Promise<Message[]> {
    return this.messageModel
      .find({
        $or: [
          { to, from },
          { to: from, from: to },
        ],
      })
      .lean();
  }

  async saveMessage(messageData: MessageData): Promise<Message> {
    try {
      const newMessage = new this.messageModel({ ...messageData });

      return newMessage.save();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
