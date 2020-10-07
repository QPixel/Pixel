import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandReload extends Command {
  constructor () {
    super("reload-all", {
      aliases: [ "reloadall" ],
      category: "Util"
    });
  }
  async exec(message: Message): Promise<void> {
    message.channel.send(":repeat: Reloading all commands!");
    const commandHandler = this.handler;
    try {
      commandHandler.reloadAll();
      console.log("Reloading all Commands!");
      message.channel.send(":+1: Commands Reloaded!");
    } catch (e) {
      console.log(e);
      message.channel.send(":interrobang: Commands couldn't be reloaded....");
    }
  }
}