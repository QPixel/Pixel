import { Command } from "discord-akairo";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IGuild, IMessage, ISong } from "typings";

export default class CommandSkip extends Command {
  public constructor () {
    super("skip", {
      aliases: [ "s", "skip" ],
      category: "Player",
    });
  }
  public exec(message: IMessage): Promise<void | Message> {
    if (!message.member.voice.channel) return message.reply("You're not in a voice channel");
    if (!message.guild.queue) return message.reply("There is nothing playing");
    if (message.member.voice.channel.id !== message.guild.queue.voiceChannel.id) return message.reply("You need to be in the same voice channel as mine");

    message.guild.queue.playing = true;
    message.guild.queue.connection.dispatcher.resume();
    message.guild.queue.connection.dispatcher.end();

    return message.reply("Skipped");

  }
}