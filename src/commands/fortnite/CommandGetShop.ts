import Auth from "../../lib/auth";
import { Command } from "discord-akairo";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { Main } from "../../index";
export default class CommandGetShop extends Command {
  constructor () {
    super("getshop", {
      aliases: [ "getshop" ]
    });
  }

  async exec(message: Message): Promise<Message> {
    const embed = createEmbed({ title: "Uhhh is a mood" });
    embed.addField("This is my", "Mood");
    await Main.Shop.getShop(Auth.accessToken);
    return message.channel.send(embed);
  }
}