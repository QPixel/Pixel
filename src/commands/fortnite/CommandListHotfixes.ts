import Auth from "../../lib/auth";
import HotfixClient from "../../util/Hotfix";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";

export default class CommandListHotfixes extends Command {
  constructor() {
    super("listhotfix", {
      aliases: [ "listhotfix" ],
    });
  }
  async exec(message: Message): Promise<Message>  {
    const token = Auth.accessToken;
    const hotfixClient = new HotfixClient();
    const hotfixres = await hotfixClient.client(token, true);
    const embed = createEmbed({
      title: "Hotfix Response"
    });
    for (let i = 0; i < hotfixres.length; i += 1) {
      embed.addField(hotfixres[i], hotfixres[i + 1]);
    }
    return message.channel.send(embed);
    // console.log(JSON.stringify(hotfixres, null, 2));
  }
}
