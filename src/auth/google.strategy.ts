import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const apiUrl = configService.get<string>('API_URL') || 'http://localhost:3001';
    const options: StrategyOptions = {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') || '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') || '',
      callbackURL: `${apiUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
    };
    super(options);
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
    const { emails, photos, id, displayName } = profile;
    const user = {
      email: emails[0].value,
      username: displayName,
      avatar: photos[0].value,
      provider: 'google',
      providerId: id,
      accessToken,
    };
    done(null, user);
  }
}
