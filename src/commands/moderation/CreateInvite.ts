import Auth from "../../lib/auth";
import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
export default class CommandCreateInvite extends Command {
  constructor () {
    super("creatinvite", {
      aliases: [ "creatinvite" ]
    });
  }

  async exec(message: Message): Promise<void> {
    this.client.logger.info(this.client.guilds.cache.array());
    const invite = this.client.guilds.cache.array()[1];
    console.log(invite.id);
  }
  
}