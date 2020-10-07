import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandCurl extends Command {
  constructor () {
    super("curl", {
      args: [
        {
          id: "uri",
          type: "string"
        },
        {
          id: "arg1",
          type: "string"
        },
        {
          id: "arg2",
          type: "string"
        },
        {
          id: "headers",
          type: "object",
          default: {
            "Content-Type": "application/json"
          }
        }
      ]
    });
  }
  async exec(message: Message, args: Record<string, string | Record<string, string>>): Promise<Message> {
    console.log(args);
    return message.channel.send("Hello");
  }
}