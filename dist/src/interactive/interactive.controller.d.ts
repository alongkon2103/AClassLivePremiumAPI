import { UserProductsService } from './user-products.service';
import { InteractiveService } from './interactive.service';
export declare class InteractiveController {
    private readonly interactiveService;
    private readonly userProductsService;
    constructor(interactiveService: InteractiveService, userProductsService: UserProductsService);
    getStoreProducts(req: any): Promise<{
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
    getMyProducts(req: any): Promise<({
        user_function_gifts: ({
            gifts: {
                id: number;
                name: string;
                image_url: string | null;
                diamonds: number;
                is_active: boolean;
                sort_order: number;
                trigger_type: string | null;
            };
        } & {
            id: string;
            user_id: string;
            updated_at: Date;
            order_id: string;
            function_id: string;
            gift_id: number;
            trigger_threshold: number | null;
            is_enabled: boolean;
        })[];
        products: {
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
        };
    } & {
        id: string;
        created_at: Date | null;
        user_id: string;
        expires_at: Date | null;
        paid_at: Date | null;
        status: string;
        product_id: string;
        stripe_session_id: string | null;
        stripe_payment_intent: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        fulfilled_at: Date | null;
        variant_id: string | null;
        payment_method: string | null;
        slip_image_url: string | null;
        slip_verified: boolean | null;
        trans_ref: string | null;
        updated_at: Date | null;
        whitelisted_username: string | null;
        whitelist_status: string | null;
        tiktok_username: string | null;
        activated_device_id: string | null;
        activated_at: Date | null;
        is_premium_order: boolean | null;
        order_type: string;
    })[]>;
    deploy(req: any, data: any): Promise<{
        id: string;
        created_at: Date | null;
        user_id: string;
        expires_at: Date | null;
        paid_at: Date | null;
        status: string;
        product_id: string;
        stripe_session_id: string | null;
        stripe_payment_intent: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
        fulfilled_at: Date | null;
        variant_id: string | null;
        payment_method: string | null;
        slip_image_url: string | null;
        slip_verified: boolean | null;
        trans_ref: string | null;
        updated_at: Date | null;
        whitelisted_username: string | null;
        whitelist_status: string | null;
        tiktok_username: string | null;
        activated_device_id: string | null;
        activated_at: Date | null;
        is_premium_order: boolean | null;
        order_type: string;
    }>;
    updateMapping(req: any, id: string, mappings: any[]): Promise<{
        success: boolean;
    }>;
    remove(req: any, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
