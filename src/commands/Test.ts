import { Command } from "discord-akairo";
import { Message } from "discord.js";



export default class Test extends Command {
  constructor() {
    super("test", {
      aliases: [ "test", "test1" ],
    });    
  }
  async exec(message: Message): Promise<Message> {
    return message.channel.send("Hello, test");
  }
}