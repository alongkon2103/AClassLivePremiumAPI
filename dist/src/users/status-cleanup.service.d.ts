import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class StatusCleanupService implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    cleanupOfflineUsers(): Promise<void>;
}
