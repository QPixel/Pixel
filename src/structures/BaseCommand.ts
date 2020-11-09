import { resolve } from "path";
import type Client from "../client";
import { Command } from "discord-akairo";
import type { Message } from "discord.js";
import { CommandComponent } from "typings";

export default class BaseCommand implements CommandComponent {
  public conf: CommandComponent["conf"];
  public help: CommandComponent["help"];
  public constructor(public client: Client, public readonly path: string, conf: CommandComponent["conf"], help: CommandComponent["help"]) {
    this.conf = {
      aliases: [],
      cooldown: 3,
      disable: false,
      path: resolve(this.path),
    };
    this.help = {
      name: "",
      description: "",
      usage: ""
    };
    Object.assign(this.conf, conf);
    Object.assign(this.help, help);
  }
  public execute(message: Message, args: string[]): void | Message {};
}