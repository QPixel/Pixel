import { AkairoClient, CommandHandler } from "discord-akairo";
import { prefix } from "./util/env";
import { join } from "path";

export default class Client extends AkairoClient {
  commandHandler: CommandHandler;
  queue: Map<string, unknown>
  constructor () {
    super({
      ownerID: "218072060923084802"
    }, {
      disableMentions: "everyone"
    });
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, "./commands/"),
      prefix: prefix,
      extensions: [ ".ts" , ".js" ]
    });
    this.commandHandler.loadAll();
    this.queue = new Map();
    const test = this.commandHandler.modules;
    test.keyArray().forEach((element) => {
      console.log(element);
    });
  }
};