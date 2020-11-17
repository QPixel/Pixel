// import { Command } from "discord-akairo";
import BaseCommand from "../../structures/BaseCommand";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IGuild, IMessage, ISong } from "typings";

export default class CommandSkip extends BaseCommand {
  public constructor () {
    super("clearqueue", {
      aliases: [ "clearqueue", "cq" ],
      category: "Player",
    });
  }
  public exec(message: IMessage): Promise<void | Message> {
    // if (!message.member.voice.channel) return message.reply("You're not in a voice channel");
    if (!message.guild.queue) return message.reply("There is nothing playing");
    // if (message.member.voice.channel.id !== message.guild.queue.voiceChannel.id) return message.reply("You need to be in the same voice channel as mine");

    message.guild.queue.songs.clear();
    message.guild.queue = null;
    message.guild.queue.connection.disconnect();

    return message.reply("Queue Cleared and Bot has left the channel.");

  }
}