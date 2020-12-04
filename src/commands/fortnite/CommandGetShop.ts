import Auth from "../../lib/auth";
import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
export default class CommandGetShop extends Command {
  constructor () {
    super("getshop", {
      aliases: [ "getshop" ]
    });
  }

  async exec(message: Message): Promise<Message> {
    const embed = createEmbed({ title: "Uhhh is a mood" });
    embed.addField("This is my", "Mood");
    const shop = await this.client.ShopHandler.getShop(this.client.auth.accessToken);
    return message.channel.send(embed);
  }
}