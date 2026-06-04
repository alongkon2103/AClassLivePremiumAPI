import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UserProductsService } from './user-products.service';
import { InteractiveService } from './interactive.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('interactive')
@UseGuards(JwtAuthGuard)
export class InteractiveController {
  constructor(
    private readonly interactiveService: InteractiveService,
    private readonly userProductsService: UserProductsService,
  ) { }

  @Get('store-products')
  async getStoreProducts(@Req() req) {
    return this.interactiveService.getStoreProducts(req.user.userId);
  }

  @Get('my-products')
  async getMyProducts(@Req() req) {
    return this.userProductsService.findAll(req.user.userId);
  }

  @Post('deploy')
  async deploy(@Req() req, @Body() data: any) {
    return this.userProductsService.deploy(req.user.userId, data);
  }

  @Patch('my-products/:id/map')
  async updateMapping(@Req() req, @Param('id') id: string, @Body('mappings') mappings: any[]) {
    return this.userProductsService.updateMapping(req.user.userId, id, mappings);
  }

  @Delete('my-products/:id')
  async remove(@Req() req, @Param('id') id: string) {
    return this.userProductsService.remove(req.user.userId, id);
  }
  @Post('register-session')
  async registerSession(@Req() req, @Body() body: { orderId: string; username: string }) {
    return this.interactiveService.registerSession(
      req.user.userId,
      body.orderId,
      body.username,
    );
  }
}
