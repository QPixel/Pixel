import { Guild, Message, TextChannel, VoiceChannel, VoiceConnection, Collection, ClientEvents, VoiceState } from "discord.js";
import { Command } from "discord-akairo";
import type Client from "../src/client";

export interface CommandComponent {
  conf: {
    aliases?: string[];
    cooldown?: number;
    disable?: boolean;
    path?: string;
  };
  help: {
    name: string;
    description?: string;
    usage?: string;
  };
  
  execute(message: Message, args: string[]): void | Message;
}

export interface IGuild extends Guild {
  client: Client;
  queue: IServerQueue;
}

export interface IMessage extends Message {
  client: Client;
  guild: IGuild | null;
  channel: ITextChannel | INewsChannel | IDMChannel;
}
export interface ITextChannel extends TextChannel {
  client: Client;
  guild: IGuild;
}

export interface INewsChannel extends TextChannel {
  client: Client;
  guild: IGuild;
}

export interface IDMChannel extends TextChannel {
  client: Client;
  guild: IGuild;
}
export interface IServerQueue {
  textChannel: ITextChannel | INewsChannel | IDMChannel;
  voiceChannel: VoiceChannel | null;
  connection: VoiceConnection | null;
  songs: ISongs;
  volume: number;
  playing: boolean;
  loopMode: 0 | 1 | 2;
  timeout: NodeJS.Timeout | null;
}

export interface ISongs extends Collection<string, ISong> {
  addSong(song: ISong): this;
  deleteFirst() : boolean;
}
export interface ISong {
  id: string;
  title: string;
  url: string;
}

// export interface ClientEventsListener {
// name: keyof ClientEvents;
// execute(...args: ClientEvents[EventProp["name"]]):any
// }

export interface IVoiceState extends VoiceState {
  guild: IGuild;
}