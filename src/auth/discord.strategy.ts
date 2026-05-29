import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-discord';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(configService: ConfigService) {
    const apiUrl = configService.get<string>('API_URL') || 'http://localhost:3001';
    const options: StrategyOptions = {
      clientID: configService.get<string>('DISCORD_CLIENT_ID') || '123456789',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') || 'secret',
      callbackURL: `${apiUrl}/auth/discord/callback`,
      scope: ['identify', 'email'],
    };
    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { username, email, avatar, id } = profile;
    const user = {
      email: email,
      username: username,
      avatar: avatar ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png` : null,
      provider: 'discord',
      providerId: id,
      accessToken,
    };
    done(null, user);
  }
}
