import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GiftsService } from './gifts.service';

@Controller('gifts')
export class GiftsController {
  constructor(private readonly giftsService: GiftsService) {}

  @Get()
  findAll() {
    return this.giftsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.giftsService.findOneByGiftId(id);
  }
}
