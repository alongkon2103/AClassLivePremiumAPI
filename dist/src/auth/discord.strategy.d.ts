import { Strategy } from 'passport-discord';
import { ConfigService } from '@nestjs/config';
declare const DiscordStrategy_base: new (...args: [options: Strategy.StrategyOptionsWithRequest] | [options: Strategy.StrategyOptions] | [options: Strategy.StrategyOptions] | [options: Strategy.StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class DiscordStrategy extends DiscordStrategy_base {
    constructor(configService: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any>;
}
export {};
