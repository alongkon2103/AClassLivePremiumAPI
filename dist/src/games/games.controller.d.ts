import { GamesService } from './games.service';
export declare class GamesController {
    private readonly gamesService;
    constructor(gamesService: GamesService);
    findAll(): Promise<({
        presets: ({
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
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string): Promise<({
        presets: ({
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
        })[];
    } & {
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdById: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
