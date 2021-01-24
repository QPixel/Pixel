import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { IMessage } from "structures/commoninterfaces";
import createEmbed from "../../util/CreateEmbed";

export default class CommandNP extends Command {
  public constructor () {
    super("nowplaying", {
      aliases: [ "np", "nowplaying", "whatsplaying" ],
      category: "Player"
    });
  }
  public exec (message: IMessage): Promise<void | Message> {
    if (!message.guild.queue) return message.channel.send(createEmbed().setDescription("There is nothing playing").setColor("YELLOW"));
    return message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription(`${message.guild.queue.playing ? "▶  **|**  Now playing:" : "⏸  **|**  Now playing (paused):"} ` +
                `**[${message.guild.queue.songs.first()?.title as string}](${message.guild.queue.songs.first()?.url as string})**`)
      .setColor("BLUE"));
  }
}