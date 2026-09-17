import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../lib/database/prisma.service';
import {
  Prisma,
  type Hackathon,
  type HackathonParticipant,
} from '../../generated/prisma/client';
import { CreateHackathonDto } from './dto/create-hackathon.dto';
import { UpdateHackathonDto } from './dto/update-hackathon.dto';

@Injectable()
export class HackathonService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateHackathonDto, authorId: string): Promise<Hackathon> {
    return this.prisma.hackathon.create({
      data: {
        name: dto.name,
        description: dto.description,
        startDate: dto.startsAt,
        endDate: dto.endsAt,
        isActive: dto.isActive ?? true,
        authorId,
      },
    });
  }

  findAll(): Promise<Hackathon[]> {
    return this.prisma.hackathon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<Hackathon> {
    const hackathon = await this.prisma.hackathon.findUnique({
      where: { id },
    });

    if (!hackathon) {
      throw new NotFoundException(`Hackathon with id ${id} not found`);
    }

    return hackathon;
  }

  async update(id: string, dto: UpdateHackathonDto): Promise<Hackathon> {
    await this.findOne(id);

    return this.prisma.hackathon.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.startsAt !== undefined && { startDate: dto.startsAt }),
        ...(dto.endsAt !== undefined && { endDate: dto.endsAt }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  async remove(id: string): Promise<Hackathon> {
    await this.findOne(id);

    return this.prisma.hackathon.delete({
      where: { id },
    });
  }

  async join(
    hackathonId: string,
    userId: string,
  ): Promise<HackathonParticipant> {
    const hackathon = await this.findOne(hackathonId);

    if (!hackathon.isActive) {
      throw new BadRequestException('Hackathon is not active');
    }

    if (hackathon.endDate <= new Date()) {
      throw new BadRequestException('Hackathon has already ended');
    }

    try {
      return await this.prisma.hackathonParticipant.create({
        data: {
          hackathonId,
          userId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException(
          'You have already joined this hackathon',
        );
      }
      throw error;
    }
  }
}
