import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema()
export class User {
  _id: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({ type: String, required: true })
  username: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  friends: User[];

  @Prop({ type: Boolean, default: false })
  online: boolean;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
