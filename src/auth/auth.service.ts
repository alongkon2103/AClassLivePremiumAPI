import { Injectable, UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateOAuthUser(profile: any): Promise<any> {
    const { email, username, avatar, provider, providerId } = profile;

    if (!email) {
      throw new UnauthorizedException('Social account must have an email address.');
    }

    // 1. Check if account already exists
    let account = await this.prisma.accounts.findUnique({
      where: {
        provider_provider_account_id: {
          provider,
          provider_account_id: providerId,
        },
      },
      include: { users: true },
    });

    if (account) {
      if (account.users.nativeStatus === 'BANNED' || account.users.nativeStatus === 'SUSPENDED') {
        throw new UnauthorizedException('Your account has been suspended.');
      }

      // If user was kicked, reset them to ACTIVE on new login
      if (account.users.nativeStatus === 'KICKED') {
        await this.prisma.users.update({
          where: { id: account.users.id },
          data: { nativeStatus: 'ACTIVE' },
        });
      }

      // Sync user info
      if (account.users.avatar !== avatar || account.users.username !== username) {
        await this.prisma.users.update({
          where: { id: account.users.id },
          data: { avatar, username: username || account.users.username },
        });
      }
      return account.users;
    }

    // 2. Check if user exists by email
    let user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // 3. Create new user
      user = await this.prisma.users.create({
        data: {
          email,
          username: username || email.split('@')[0],
          avatar,
          role: 'user',
          nativeStatus: 'ACTIVE',
        },
      });
    } else if (user.nativeStatus !== 'ACTIVE') {
      throw new UnauthorizedException('Your account has been suspended.');
    }

    // 4. Create new account link
    await this.prisma.accounts.create({
      data: {
        user_id: user.id,
        provider,
        provider_account_id: providerId,
      },
    });

    return user;
  }

  async login(user: any, hwid?: string) {
    // Check if user has at least one successful order if they are a regular user
    if (user.role?.toLowerCase() === 'user') {
      const orderCount = await this.prisma.orders.count({
        where: {
          user_id: user.id,
          OR: [
            { status: { in: ['paid', 'fulfilled', 'completed', 'active'] } },
            { paid_at: { not: null } }
          ]
        },
      });

      if (orderCount === 0) {
        throw new UnauthorizedException('เข้าถึงถูกปฏิเสธ: คุณต้องเคยซื้อสินค้าอย่างน้อย 1 รายการเพื่อใช้งานโปรแกรมนี้');
      }
    }

    await this.prisma.users.update({
      where: { id: user.id },
      data: { 
        lastSeen: new Date(),
        isOnlineDesktop: true 
      },
    });

    if (hwid && hwid !== 'browser-dev-id') {
      if (user.hwid && user.hwid !== hwid) {
        throw new UnauthorizedException('HWID mismatch. This account is bound to another device.');
      }

      if (!user.hwid) {
        const existingUserWithHwid = await this.prisma.users.findUnique({
          where: { hwid },
        });

        if (existingUserWithHwid && existingUserWithHwid.id !== user.id) {
          throw new UnauthorizedException('This device is already bound to another account.');
        }

        await this.prisma.users.update({
          where: { id: user.id },
          data: { hwid },
        });
      }
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role,
      email: user.email 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        expiry: user.expiry,
      },
    };
  }

  async verifyHwid(userId: string, hwid: string) {
    if (!hwid || hwid === 'browser-dev-id') {
      return { success: true, message: 'Skipping HWID check for development' };
    }

    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    // Check if user has at least one successful order if they are a regular user
    if (user.role?.toLowerCase() === 'user') {
      const orderCount = await this.prisma.orders.count({
        where: {
          user_id: user.id,
          OR: [
            { status: { in: ['paid', 'fulfilled', 'completed', 'active'] } },
            { paid_at: { not: null } }
          ]
        },
      });

      if (orderCount === 0) {
        throw new UnauthorizedException('เข้าถึงถูกปฏิเสธ: คุณต้องเคยซื้อสินค้าอย่างน้อย 1 รายการเพื่อใช้งานโปรแกรมนี้');
      }
    }

    // 1. If user already has an HWID, it must match
    if (user.hwid && user.hwid !== hwid) {
      throw new UnauthorizedException('This account is bound to another device. Please contact admin to reset.');
    }

    // 2. If user doesn't have an HWID, check if this HWID is already used by another user
    if (!user.hwid) {
      const existingUserWithHwid = await this.prisma.users.findUnique({
        where: { hwid },
      });

      if (existingUserWithHwid && existingUserWithHwid.id !== user.id) {
        throw new UnauthorizedException('This device is already bound to another account.');
      }

      // 3. Bind the HWID to the user
      await this.prisma.users.update({
        where: { id: user.id },
        data: { hwid, lastSeen: new Date() },
      });

      return { success: true, message: 'HWID verified and bound' };
    }

    return { success: true, message: 'HWID verified' };
  }

  async updateLastSeen(userId: string, status: 'online' | 'offline' = 'online') {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { nativeStatus: true }
    });

    if (user && user.nativeStatus === 'KICKED') {
      this.logger.warn(`User ${userId} heartbeat rejected: KICKED`);
      // Force offline status in DB
      await this.prisma.users.update({
        where: { id: userId },
        data: { isOnlineDesktop: false }
      });
      
      return { 
        success: false, 
        action: 'forced_logout', 
        message: 'คุณถูกเตะออกจากระบบโดยผู้ดูแลระบบ' 
      };
    }

    await this.prisma.users.update({
      where: { id: userId },
      data: { 
        lastSeen: new Date(),
        isOnlineDesktop: status === 'online'
      },
    });
    return { success: true };
  }
}
