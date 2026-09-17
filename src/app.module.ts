import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './lib/auth/auth';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './lib/database/prisma.module';
import { UsersModule } from './module/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: '2mb' },
        urlencoded: { limit: '2mb', extended: true },
      },
    }),
    PrismaModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
