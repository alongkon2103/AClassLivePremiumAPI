import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatusCleanupService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    // Run cleanup every 2 minutes
    setInterval(() => this.cleanupOfflineUsers(), 120000);
  }

  async cleanupOfflineUsers() {
    try {
      // Any user who hasn't sent a heartbeat in the last 3 minutes is considered offline
      const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);

      await this.prisma.users.updateMany({
        where: {
          isOnlineDesktop: true,
          lastSeen: {
            lt: threeMinutesAgo,
          },
        },
        data: {
          isOnlineDesktop: false,
        },
      });
      // console.log('[StatusCleanup] Offline users cleaned up');
    } catch (error) {
      console.error('[StatusCleanup] Error cleaning up offline users:', error);
    }
  }
}
