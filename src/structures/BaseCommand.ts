import { resolve } from "path";
import type Client from "../client";
import { Command, ArgumentOptions as AkarioArgumentOptions, CommandOptions as AkairoCommandOptions, Flag, ArgumentOptions, ArgumentGenerator } from "discord-akairo";
import type { Message } from "discord.js";
import { CommandComponent } from "typings";

// export default class BaseCommand implements CommandComponent {
//   public conf: CommandComponent["conf"];
//   public help: CommandComponent["help"];
//   public constructor(public client: Client, public readonly path: string, conf: CommandComponent["conf"], help: CommandComponent["help"]) {
//     this.conf = {
//       aliases: [],
//       cooldown: 3,
//       disable: false,
//       path: resolve(this.path),
//     };
//     this.help = {
//       name: "",
//       description: "",
//       usage: ""
//     };
//     Object.assign(this.conf, conf);
//     Object.assign(this.help, help);
//   }
//   public execute(message: Message, args: string[]): void | Message {};
// }

export default class BaseCommand extends Command {
  client: Client;
  args?: ArgumentOptions[] | ArgumentGenerator;

  constructor(id: string, options: AkairoCommandOptions) {
    super(id, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // async exec(message: Message): Promise<Message | void> {}
}