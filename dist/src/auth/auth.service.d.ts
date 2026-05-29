import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateOAuthUser(profile: any): Promise<any>;
    login(user: any, hwid?: string): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            email: any;
            role: any;
            avatar: any;
            expiry: any;
        };
    }>;
    verifyHwid(userId: string, hwid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    updateLastSeen(userId: string, status?: 'online' | 'offline'): Promise<{
        success: boolean;
        action: string;
        message: string;
    } | {
        success: boolean;
        action?: undefined;
        message?: undefined;
    }>;
}
