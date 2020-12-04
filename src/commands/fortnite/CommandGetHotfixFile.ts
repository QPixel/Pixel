// import Auth from "../../lib/auth";
import HotfixClient from "../../util/Hotfix";
import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";

export default class CommandGetHotifxFile extends Command {
  constructor() {
    super("gethotfix", {
      aliases: [ "gethotfix" ],
      args: [
        {
          id: "fileName",
          type: "string",
          default: "DefaultEngine.ini"
        }
      ]
    });
  }
  async exec(message: Message, args: Record<string, string>): Promise<Message>  {
    const token = this.client.auth.accessToken;
    const hotfixClient = new HotfixClient();
    const hotfixres = await hotfixClient.client(token, false, args.fileName);
    return message.reply(`${args.fileName} - Pastebin: ${hotfixres}`);

  }
}
