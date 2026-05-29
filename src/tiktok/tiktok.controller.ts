import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { TiktokService } from './tiktok.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tiktok')
@UseGuards(JwtAuthGuard)
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Post('register')
  async register(@Req() req, @Body('username') username: string, @Body('orderId') orderId?: string) {
    return this.tiktokService.register(orderId || req.user.userId || req.user.orderId, username);
  }

  @Post('push-event')
  async pushEvent(@Req() req, @Body('type') type: string, @Body('data') data: any) {
    return this.tiktokService.pushEvent(req.user.userId || req.user.orderId, type, data);
  }

  @Post('heartbeat')
  async heartbeat(@Req() req) {
    return this.tiktokService.heartbeat(req.user.userId || req.user.orderId);
  }
}
