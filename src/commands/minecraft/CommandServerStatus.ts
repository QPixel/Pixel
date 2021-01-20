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
          default: "ottocraft.qpixel.me"
        }
      ]
    });
  }

  async exec(message: Message, args: {serverip: string}): Promise<Message> {
    return requestServer(args.serverip, this.client.logger, message);
  }
}