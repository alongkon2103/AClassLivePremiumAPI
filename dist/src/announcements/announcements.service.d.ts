import { PrismaService } from '../prisma/prisma.service';
export declare class AnnouncementsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(all?: boolean): Promise<{
        id: string;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        imageUrl: string | null;
        isActive: boolean;
    }[]>;
    create(userId: string, data: any): Promise<{
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
