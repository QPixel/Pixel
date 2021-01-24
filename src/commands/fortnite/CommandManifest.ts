import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import { IMessage } from "structures/commoninterfaces";
import createEmbed from "../../util/CreateEmbed";


export default class CommandManifest extends Command {
  constructor () {
    super("manifest", {
      aliases: [ "manifest" ],
      category: "fortnite",
    });
  }

  exec(message: IMessage): Promise<Message> {
    const embed = createEmbed({ title: "Fortnite Manifest", color: "#0099ff" }).setDescription("Version: " + this.client.ManifestHandler.buildnumber);
    
    embed.addField("Current Manifest", "- " + this.client.ManifestHandler.manifest);
    embed.addField("Current Build", "- " + "++Fortnite-Release-"+ this.client.ManifestHandler.build);
    return message.channel.send(embed);
  }
}