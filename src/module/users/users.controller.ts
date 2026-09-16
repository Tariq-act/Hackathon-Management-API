import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';

class CreateUserDto {
  email!: string;
  name?: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body.email, body.name);
  }

  @Get()
  findUsers() {
    return this.usersService.findUsers();
  }
}
