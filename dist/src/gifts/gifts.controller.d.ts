import { GiftsService } from './gifts.service';
export declare class GiftsController {
    private readonly giftsService;
    constructor(giftsService: GiftsService);
    findAll(): Promise<{
        id: number;
        name: string;
        image_url: string | null;
        diamonds: number;
        is_active: boolean;
        sort_order: number;
        trigger_type: string | null;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        name: string;
        image_url: string | null;
        diamonds: number;
        is_active: boolean;
        sort_order: number;
        trigger_type: string | null;
    } | null>;
}
