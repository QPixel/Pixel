import { Message } from "discord.js";
import { IMessage } from "typings";
import BaseCommand from "../structures/BaseCommand";

export default class CommandReload extends BaseCommand {
  constructor () {
    super("test", {
      aliases: [ "test" ],
      category: "Util"
    });
  }
  async exec(message: IMessage): Promise<void> {
    
  }
}
