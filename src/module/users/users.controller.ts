import { Controller, Get, Param } from '@nestjs/common';
import { Roles, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
import { UsersService } from './users.service';
import { ResponseMessage } from '../../common/decorators/response-message.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@Session() session: UserSession) {
    return { user: session.user };
  }

  @Get('all')
  @Roles(['ADMIN'])
  @ResponseMessage('Fetch all users successfully')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
