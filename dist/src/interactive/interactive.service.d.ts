import { PrismaService } from '../prisma/prisma.service';
export declare class InteractiveService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getStoreProducts(userId: string): Promise<{
        success: boolean;
        data: ({
            product_functions: ({
                default_gift: {
                    id: number;
                    name: string;
                    image_url: string | null;
                    diamonds: number;
                    is_active: boolean;
                    sort_order: number;
                    trigger_type: string | null;
                } | null;
            } & {
                id: string;
                created_at: Date | null;
                name: string;
                image_url: string | null;
                sort_order: number;
                product_id: string;
                label_th: string | null;
                label_en: string | null;
                default_gift_id: number | null;
                default_trigger_threshold: number | null;
            })[];
            product_images: {
                url: string;
                id: string;
                created_at: Date | null;
                sort_order: number | null;
                product_id: string;
                alt_text: string | null;
            }[];
        } & {
            id: string;
            created_at: Date | null;
            is_active: boolean | null;
            updated_at: Date | null;
            slug: string;
            name_th: string;
            name_en: string;
            description_th: string | null;
            description_en: string | null;
            price: import("@prisma/client-runtime-utils").Decimal;
            is_featured: boolean | null;
            isLower: boolean | null;
            owner_name: string | null;
            owner_contact: string | null;
            commission_pct: import("@prisma/client-runtime-utils").Decimal | null;
            is_consignment: boolean | null;
            info_page_url: string | null;
            discord_role_id: string | null;
            discord_guild_id: string | null;
            youtube_url: string | null;
            tutorial_video_url: string | null;
            created_by_id: string | null;
        })[];
    }>;
}
