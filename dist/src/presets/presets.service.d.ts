import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class PresetsService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, role: UserRole): Promise<({
        user_presets: {
            id: string;
            createdAt: Date;
            isActive: boolean;
            userId: string;
            presetId: string;
            sourcePresetId: string | null;
        }[];
        rules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            event: import("@prisma/client").$Enums.RuleEvent;
            condition: import("@prisma/client/runtime/client").JsonValue | null;
            action: import("@prisma/client").$Enums.RuleAction;
            key: string | null;
            sound: string | null;
            volume: number | null;
            duration: string | null;
            presetId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    })[]>;
    findMyPresets(userId: string): Promise<({
        preset: {
            rules: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                event: import("@prisma/client").$Enums.RuleEvent;
                condition: import("@prisma/client/runtime/client").JsonValue | null;
                action: import("@prisma/client").$Enums.RuleAction;
                key: string | null;
                sound: string | null;
                volume: number | null;
                duration: string | null;
                presetId: string;
            }[];
        } & {
            id: string;
            name: string;
            description: string | null;
            createdById: string | null;
            createdAt: Date;
            updatedAt: Date;
            isDefault: boolean;
            gameId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        isActive: boolean;
        userId: string;
        presetId: string;
        sourcePresetId: string | null;
    })[]>;
    adopt(userId: string, presetId: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        userId: string;
        presetId: string;
        sourcePresetId: string | null;
    }>;
    fork(userId: string, presetId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }>;
    activate(userId: string, userPresetId: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        userId: string;
        presetId: string;
        sourcePresetId: string | null;
    }>;
    findOne(id: string): Promise<({
        rules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            event: import("@prisma/client").$Enums.RuleEvent;
            condition: import("@prisma/client/runtime/client").JsonValue | null;
            action: import("@prisma/client").$Enums.RuleAction;
            key: string | null;
            sound: string | null;
            volume: number | null;
            duration: string | null;
            presetId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }) | null>;
    create(userId: string, data: any): Promise<{
        rules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            event: import("@prisma/client").$Enums.RuleEvent;
            condition: import("@prisma/client/runtime/client").JsonValue | null;
            action: import("@prisma/client").$Enums.RuleAction;
            key: string | null;
            sound: string | null;
            volume: number | null;
            duration: string | null;
            presetId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }>;
    update(id: string, data: any, user: any): Promise<{
        rules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            event: import("@prisma/client").$Enums.RuleEvent;
            condition: import("@prisma/client/runtime/client").JsonValue | null;
            action: import("@prisma/client").$Enums.RuleAction;
            key: string | null;
            sound: string | null;
            volume: number | null;
            duration: string | null;
            presetId: string;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }>;
    remove(id: string, user: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }>;
}
