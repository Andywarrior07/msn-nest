import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

@Schema()
export class Message {
  _id: string;

  @Prop({ type: String, required: true })
  from: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, required: true })
  sentAt: string;
}
export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);
