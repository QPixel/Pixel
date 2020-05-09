import { CommandMessage } from '@typeit/discord';
export declare class CommandRequest {
    request(command: CommandMessage): Promise<void>;
}
