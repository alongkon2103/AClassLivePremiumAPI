import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string | null;
        hwid: string | null;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date | null;
        avatar: string | null;
        lastSeen: Date | null;
        isOnlineDesktop: boolean;
        nativeStatus: string;
        nativeExpiry: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string | null;
        hwid: string | null;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date | null;
        avatar: string | null;
        lastSeen: Date | null;
        isOnlineDesktop: boolean;
        nativeStatus: string;
        nativeExpiry: Date | null;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        email: string | null;
        hwid: string | null;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date | null;
        avatar: string | null;
        lastSeen: Date | null;
        isOnlineDesktop: boolean;
        nativeStatus: string;
        nativeExpiry: Date | null;
    }>;
    resetHwid(id: string): Promise<{
        id: string;
        email: string | null;
        hwid: string | null;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date | null;
        avatar: string | null;
        lastSeen: Date | null;
        isOnlineDesktop: boolean;
        nativeStatus: string;
        nativeExpiry: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        email: string | null;
        hwid: string | null;
        username: string;
        role: import("@prisma/client").$Enums.Role;
        created_at: Date | null;
        avatar: string | null;
        lastSeen: Date | null;
        isOnlineDesktop: boolean;
        nativeStatus: string;
        nativeExpiry: Date | null;
    }>;
}
