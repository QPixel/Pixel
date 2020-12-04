import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";



export default class CommandGetAuth extends Command {
  constructor () {
    super("getauth", {
      aliases: [ "getauth", "ga" ],
      category: "fortnite",
      args: [
        {
          id: "username",
          type: "string",
          default: "QPixel_"
        }
      ]
    });
  }

  async exec(message: Message, args: {username: string}): Promise<void> {
    console.log(this.client.auth.accessToken);
  }
}