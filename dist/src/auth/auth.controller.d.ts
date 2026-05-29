import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    googleAuth(req: any): Promise<void>;
    googleAuthRedirect(req: any, res: any): Promise<any>;
    discordAuth(req: any): Promise<void>;
    discordAuthRedirect(req: any, res: any): Promise<any>;
    verifyHwid(req: any, hwid: string): Promise<{
        success: boolean;
        message: string;
    }>;
    heartbeat(req: any, status: 'online' | 'offline'): Promise<{
        success: boolean;
        action: string;
        message: string;
    } | {
        success: boolean;
        action?: undefined;
        message?: undefined;
    }>;
}
