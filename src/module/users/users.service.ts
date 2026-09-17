import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import type { User } from '../../generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
