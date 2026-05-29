import { PrismaService } from '../prisma/prisma.service';
export declare class TiktokService {
    private prisma;
    private readonly logger;
    private activeOrderSessions;
    constructor(prisma: PrismaService);
    register(userIdOrOrderId: string, username: string): Promise<{
        success: boolean;
        simulator: boolean;
    } | {
        success: boolean;
        simulator?: undefined;
    }>;
    pushEvent(userIdOrOrderId: string, type: string, data: any): Promise<{
        success: boolean;
        pushed: boolean;
        simulator: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: string;
        pushed?: undefined;
        simulator?: undefined;
    } | {
        success: boolean;
        pushed: boolean;
        simulator?: undefined;
        error?: undefined;
    }>;
    heartbeat(userIdOrOrderId: string): Promise<{
        success: boolean;
    }>;
}
