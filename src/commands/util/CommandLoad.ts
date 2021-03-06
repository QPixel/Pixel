import { Command } from "discord-akairo";
import { Message } from "discord.js";
import BaseCommand from "../../structures/BaseCommand";

interface Args {
  fileName: string;
  directory: boolean;
}
export default class CommandLoad extends BaseCommand{
  constructor () {
    super("loadcommand", {
      aliases: [ "loadcommand", "load-command" ],
      category: "Util",
      args: [
        {
          id: "fileName",
          type: "string"
        },
        {
          id: "directory",
          type: "boolean",
          default: false
        }
      ]
    });
  }
  async exec(message: Message, args: Args): Promise<void> {
    const commandName = args.fileName;
    const useDirectory = args.directory;
    // const commandHandler = this.client.commandHandler;
    if (useDirectory) {
      message.channel.send("<a:loadingdots:759625992166965288> Loading directory " + commandName);
      try {
        this.client.commandHandler.loadAll(commandName);
        console.log(`Loading all Commands from ${commandName}!`);
        message.channel.send(":+1: Commands Loaded");
      } catch (e) {
        console.error(e);
        message.channel.send(":interrobang: Commands couldn't be loaded....");
      }
    } else {
      message.channel.send("<a:loadingdots:759625992166965288> Loading Command " + commandName);
      try {
        this.client.commandHandler.load(commandName, false);
        // this.client.logger.debug()
        // this.client.commandHandler.blockBots
        message.channel.send(":+1: Command Loaded!");
      } catch (e) {
        console.log(e);
        message.channel.send(":interrobang: Command couldn't be loaded....");
      }
    }
  }
}
