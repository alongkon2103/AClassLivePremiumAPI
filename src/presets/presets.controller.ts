import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PresetsService } from './presets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('presets')
@UseGuards(JwtAuthGuard)
export class PresetsController {
  constructor(private readonly presetsService: PresetsService) {}

  @Get()
  findAll(@Request() req) {
    return this.presetsService.findAll(req.user.userId, req.user.role);
  }

  @Get('my')
  findMyPresets(@Request() req) {
    return this.presetsService.findMyPresets(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presetsService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() data: any) {
    return this.presetsService.create(req.user.userId, data);
  }

  @Post(':id/adopt')
  adopt(@Request() req, @Param('id') id: string) {
    return this.presetsService.adopt(req.user.userId, id);
  }

  @Post(':id/fork')
  fork(@Request() req, @Param('id') id: string) {
    return this.presetsService.fork(req.user.userId, id);
  }

  @Patch('my/:userPresetId/activate')
  activate(@Request() req, @Param('userPresetId') userPresetId: string) {
    return this.presetsService.activate(req.user.userId, userPresetId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() data: any) {
    return this.presetsService.update(id, data, req.user);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.presetsService.remove(id, req.user);
  }
}
