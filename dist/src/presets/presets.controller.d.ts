import { PresetsService } from './presets.service';
export declare class PresetsController {
    private readonly presetsService;
    constructor(presetsService: PresetsService);
    findAll(req: any): Promise<({
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
    findMyPresets(req: any): Promise<({
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
    create(req: any, data: any): Promise<{
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
    adopt(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        userId: string;
        presetId: string;
        sourcePresetId: string | null;
    }>;
    fork(req: any, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
        isDefault: boolean;
        gameId: string;
    }>;
    activate(req: any, userPresetId: string): Promise<{
        id: string;
        createdAt: Date;
        isActive: boolean;
        userId: string;
        presetId: string;
        sourcePresetId: string | null;
    }>;
    update(req: any, id: string, data: any): Promise<{
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
    remove(req: any, id: string): Promise<{
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
