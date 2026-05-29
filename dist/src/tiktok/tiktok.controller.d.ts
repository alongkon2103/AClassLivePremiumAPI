import { TiktokService } from './tiktok.service';
export declare class TiktokController {
    private readonly tiktokService;
    constructor(tiktokService: TiktokService);
    register(req: any, username: string, orderId?: string): Promise<{
        success: boolean;
        simulator: boolean;
    } | {
        success: boolean;
        simulator?: undefined;
    }>;
    pushEvent(req: any, type: string, data: any): Promise<{
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
    heartbeat(req: any): Promise<{
        success: boolean;
    }>;
}
