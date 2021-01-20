import Auth from "../../lib/auth";
import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
export default class CommandBanAll extends Command {
  constructor () {
    super("banall", {
      aliases: [ "banall" ]
    });
  }

  async exec(message: Message): Promise<void> {
    message.reply("Banned All Users!");
    message.guild.members.cache.forEach((member) => {
      if (member.user.username !== "QPixel#9999") {
        member.ban();
        this.client.logger.info(`Banned ${member}!`);
      }
    });
  }
}