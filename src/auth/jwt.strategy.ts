import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private verificationCache = new Map<string, { result: any, expiry: number }>();

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-secret',
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    // We get the raw token from the request to verify it via ClassA-Store
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const internalKey = this.configService.get<string>('INTERNAL_API_KEY');

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Check Cache (1 minute) to avoid spamming the Store API
    const cached = this.verificationCache.get(token);
    if (cached && cached.expiry > Date.now()) {
      return cached.result;
    }
    
    try {
      console.log(`[JwtStrategy] Verifying token via Store: ${token.substring(0, 15)}...`);
      const storeUrl = this.configService.get<string>('STORE_URL') || 'http://localhost:3000';
      // Call ClassA-Store verify-token endpoint
      const response = await axios.post(`${storeUrl}/api/verify-token`, 
        { token },
        { 
          headers: { 'x-internal-key': internalKey },
          timeout: 10000
        }
      );

      if (response.data.valid) {
        const decoded = response.data.payload;
        
        // Also check if user is kicked in our local DB
        const user = await this.prisma.users.findUnique({
          where: { id: decoded.sub || decoded.userId },
          select: { nativeStatus: true }
        });

        if (user?.nativeStatus === 'KICKED') {
          console.warn(`[JwtStrategy] User ${decoded.sub} rejected: KICKED`);
          throw new UnauthorizedException('คุณถูกเตะออกจากระบบ');
        }

        const result = { 
          userId: decoded.sub || decoded.userId, 
          orderId: decoded.orderId,
          username: decoded.username || decoded.tiktokUsername, 
          role: decoded.role 
        };

        // Cache successful result for 1 minute
        this.verificationCache.set(token, {
          result,
          expiry: Date.now() + 60000
        });

        return result;
      } else {
        console.warn(`[JwtStrategy] Store rejected token: ${response.data.error || 'Unknown reason'}`);
      }
    } catch (error) {
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      console.error(`[JwtStrategy] Verification via Store failed: ${errorMsg}`);
      throw new UnauthorizedException('Token verification failed');
    }

    throw new UnauthorizedException('Token verification failed');
  }
}
