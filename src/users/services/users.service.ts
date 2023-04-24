import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User, UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.model
      .find()
      .select('email username')
      .populate({ path: 'friends', select: 'email username' })
      .lean();
  }

  async getUserFriends(id: string): Promise<User[]> {
    const asd = new Types.ObjectId(id);
    return this.model.find({ friends: asd }).populate('friends').lean();
  }

  async getUserById(id: string): Promise<User> {
    return this.model
      .findById(id)
      .select('_id friends')
      .populate({ path: 'friends', select: 'email username' })
      .lean();
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.model(createUserDto);

    return user.save();
  }
}
