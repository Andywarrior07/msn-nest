import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';
import { GetUser } from '../guards/user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('/')
  async getUsers(@GetUser() user: User): Promise<User[]> {
    return this.service.getUsers();
  }

  @Get('/friends')
  async getUserFriends(@GetUser() user: any): Promise<User[]> {
    return this.service.getUserFriends(user.sub);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    return this.service.getUserById(id);
  }

  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.service.createUser(createUserDto);
  }
}
