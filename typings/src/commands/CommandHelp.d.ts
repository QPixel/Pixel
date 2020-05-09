import { CommandMessage, Client } from '@typeit/discord';
export declare class CommandHelp {
    help(command: CommandMessage, client: Client): Promise<void>;
}
