import { PrismaService } from '../prisma/prisma.service';
export declare class GiftsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        name: string;
        image_url: string | null;
        diamonds: number;
        is_active: boolean;
        sort_order: number;
        trigger_type: string | null;
    }[]>;
    findOneByGiftId(giftId: number): Promise<{
        id: number;
        name: string;
        image_url: string | null;
        diamonds: number;
        is_active: boolean;
        sort_order: number;
        trigger_type: string | null;
    } | null>;
}
