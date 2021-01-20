import axios from "axios";
import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import requestServer from "../../util/ServerRequest";
// import createEmbed from "../../util/CreateEmbed";

export default class CommandServerStatus extends Command {
  constructor() {
    super("serverstaus", {
      aliases: [ "serverstatus" ],
      args: [
        {
          id: "serverip",
          type: "string",
        }
      ]
    });
  }

  async exec(message: Message, args: {serverip: string}): Promise<Message> {
    if (!args.serverip || args.serverip === "") return message.reply("You did not supply an argument");
    return requestServer(args.serverip, this.client.logger, message);
  }
}