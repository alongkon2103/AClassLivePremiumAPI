import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { StatusCleanupService } from './status-cleanup.service';

@Module({
  providers: [UsersService, StatusCleanupService],
  controllers: [UsersController],
})
export class UsersModule {}
