import 'reflect-metadata';
import { Client, CommandMessage } from '@typeit/discord';
export declare function pullManifest(): Promise<string[]>;
export declare class AppDiscord {
    aesCompare: string;
    versionCompare: string;
    private static _client;
    static get Client(): Client;
    static start(): Promise<void>;
    static sendMessagetoUser(userId: string, message: any): Promise<void>;
    hello(command: CommandMessage): void;
    getAes(command: CommandMessage): Promise<void>;
    manifest(command: CommandMessage): void;
    updateMode(command: CommandMessage): Promise<void>;
    checkStaging(command: CommandMessage): Promise<void>;
    fortniteStatus(command: CommandMessage): Promise<void>;
    isFortniteDown(command: CommandMessage): Promise<void>;
    request(command: CommandMessage): Promise<void>;
    notFound(command: CommandMessage): void;
}
