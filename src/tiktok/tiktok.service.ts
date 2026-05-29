import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TiktokService {
  private readonly logger = new Logger(TiktokService.name);
  private activeOrderSessions = new Map<string, string>(); // userId -> orderId

  constructor(private prisma: PrismaService) {}

  async register(userIdOrOrderId: string, username: string) {
    let userId = userIdOrOrderId;
    let orderId = userIdOrOrderId;
    
    // Validate if it's a UUID before querying
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(userIdOrOrderId)) {
      const order = await this.prisma.orders.findUnique({
        where: { id: userIdOrOrderId },
        select: { user_id: true }
      });
      
      if (order) {
        userId = order.user_id;
        orderId = userIdOrOrderId;
      }
    } else if (userIdOrOrderId === 'simulator') {
       this.logger.log('Simulator registration');
       // For simulator, we don't necessarily need to track it the same way
       return { success: true, simulator: true };
    }

    this.logger.log(`Registering session for user ${userId} with order ${orderId} (@${username})`);
    console.log(`[SYSTEM] Registered: ${username} (order: ${orderId})`);
    
    // Track which order is active for this user
    this.activeOrderSessions.set(userId, orderId);

    try {
      await this.prisma.users.update({
        where: { id: userId },
        data: { isOnlineDesktop: true, lastSeen: new Date() },
      });
    } catch (e) {
      this.logger.warn(`Could not update user status: ${e.message}`);
    }
    return { success: true };
  }

  async pushEvent(userIdOrOrderId: string, type: string, data: any) {
    let userId = userIdOrOrderId;
    let orderId = userIdOrOrderId;

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(userIdOrOrderId)) {
      const order = await this.prisma.orders.findUnique({
        where: { id: userIdOrOrderId },
        select: { user_id: true }
      });
      
      if (order) {
        userId = order.user_id;
        orderId = userIdOrOrderId;
      }
    } else if (userIdOrOrderId === 'simulator') {
      return { success: true, pushed: true, simulator: true };
    }

    // Verify if this is the ACTIVE order for the user
    const activeOrder = this.activeOrderSessions.get(userId);
    if (activeOrder && activeOrder !== orderId) {
      this.logger.warn(`Rejected event from order ${orderId}: user ${userId} has ${activeOrder} active.`);
      return { success: false, error: 'Session mismatch: another game is active' };
    }

    this.logger.log(`Received TikTok event [${type}] from user ${userId} (Order: ${orderId})`);
    console.log(`[EVENT] ${type} from ${userId} (active order: ${activeOrder})`);
    
    try {
      await this.prisma.users.update({
        where: { id: userId },
        data: { lastSeen: new Date() },
      });
    } catch (e) {}
    
    return { success: true, pushed: true };
  }

  async heartbeat(userIdOrOrderId: string) {
    let userId = userIdOrOrderId;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (uuidRegex.test(userIdOrOrderId)) {
      const order = await this.prisma.orders.findUnique({
        where: { id: userIdOrOrderId },
        select: { user_id: true }
      });
      
      if (order) {
        userId = order.user_id;
      }
    } else if (userIdOrOrderId === 'simulator') {
      return { success: true };
    }

    try {
      await this.prisma.users.update({
        where: { id: userId },
        data: { isOnlineDesktop: true, lastSeen: new Date() },
      });
    } catch (e) {}
    return { success: true };
  }
}
