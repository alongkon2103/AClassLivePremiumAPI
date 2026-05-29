import { Module } from '@nestjs/common';
import { InteractiveController } from './interactive.controller';
import { InteractiveService } from './interactive.service';
import { UserProductsService } from './user-products.service';

@Module({
  controllers: [InteractiveController],
  providers: [InteractiveService, UserProductsService],
})
export class InteractiveModule {}
