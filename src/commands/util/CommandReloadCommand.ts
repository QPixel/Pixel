import { Command } from "discord-akairo";
import { Message } from "discord.js";
import BaseCommand from "../../structures/BaseCommand";

export default class CommandReload extends BaseCommand {
  constructor () {
    super("reload-command", {
      aliases: [ "reloadcommand" ],
      category: "Util",
      args: [
        {
          id: "commandName",
          type: "string",
        }
      ]
    });
  }
  async exec(message: Message, args: Record<string, string>): Promise<void> {
    message.channel.send(":repeat: Reloading command: " + args.commandName);
    const commandHandler = this.client.commandHandler;
    try {
      commandHandler.reload(args.commandName);
      console.log("Reloaded Command " + args.commandName);
      message.channel.send(":+1: Command Reloaded!");
    } catch (e) {
      message.channel.send(":interrobang: Command couldn't be reloaded....");
      message.channel.send("Most likely this command does not exist or you typed it wrong. <:pepePoint:754646957557022780>");
    }
  }
}