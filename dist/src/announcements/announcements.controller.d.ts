import { AnnouncementsService } from './announcements.service';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(admin?: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        imageUrl: string | null;
        isActive: boolean;
    }[]>;
    create(req: any, data: any): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        imageUrl: string | null;
        isActive: boolean;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        imageUrl: string | null;
        isActive: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        imageUrl: string | null;
        isActive: boolean;
    }>;
}
