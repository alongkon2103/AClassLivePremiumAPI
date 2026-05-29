import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PresetsModule } from './presets/presets.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { GamesModule } from './games/games.module';
import { GiftsModule } from './gifts/gifts.module';
import { UploadsModule } from './uploads/uploads.module';
import { InteractiveModule } from './interactive/interactive.module';
import { TiktokModule } from './tiktok/tiktok.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    PresetsModule,
    AnnouncementsModule,
    GamesModule,
    GiftsModule,
    UploadsModule,
    InteractiveModule,
    TiktokModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
