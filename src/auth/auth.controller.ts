import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const webUrl = this.configService.get<string>('WEB_URL') || 'http://localhost:5173';
    try {
      const user = await this.authService.validateOAuthUser(req.user);
      const result = await this.authService.login(user);
      
      const token = result.access_token;
      const userData = encodeURIComponent(JSON.stringify(result.user));
      
      return res.redirect(`${webUrl}/login?token=${token}&user=${userData}`);
    } catch (error) {
      const message = encodeURIComponent(error.message || 'Authentication failed');
      return res.redirect(`${webUrl}/login?error=${message}`);
    }
  }

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  async discordAuth(@Req() req) {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordAuthRedirect(@Req() req, @Res() res) {
    const webUrl = this.configService.get<string>('WEB_URL') || 'http://localhost:5173';
    try {
      const user = await this.authService.validateOAuthUser(req.user);
      const result = await this.authService.login(user);
      
      const token = result.access_token;
      const userData = encodeURIComponent(JSON.stringify(result.user));
      
      return res.redirect(`${webUrl}/login?token=${token}&user=${userData}`);
    } catch (error) {
      const message = encodeURIComponent(error.message || 'Authentication failed');
      return res.redirect(`${webUrl}/login?error=${message}`);
    }
  }

  @Post('verify-hwid')
  @UseGuards(JwtAuthGuard)
  async verifyHwid(@Req() req, @Body('hwid') hwid: string) {
    return this.authService.verifyHwid(req.user.userId, hwid);
  }

  @Post('heartbeat')
  @UseGuards(JwtAuthGuard)
  async heartbeat(@Req() req, @Body('status') status: 'online' | 'offline') {
    return this.authService.updateLastSeen(req.user.userId, status);
  }
}
