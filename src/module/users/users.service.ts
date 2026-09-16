import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import type { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(email: string, name?: string): Promise<User> {
    return this.prisma.user.create({
      data: { email, name },
    });
  }

  findUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
