import { Command } from "discord-akairo";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IMessage } from "structures/commoninterfaces";

export default class CommandPause extends Command {
  public constructor () {
    super("pause", {
      aliases: [ "pause" ],
      category: "Player"
    });
  }
  public exec(message: IMessage): Promise<void | Message> {
    if (!message.member.voice.channel) return message.reply("You're not in a voice channel");
    if (!message.guild.queue) return message.reply("There is nothing playing");
    if (message.member.voice.channel.id !== message.guild.queue.voiceChannel.id) return message.reply("You need to be in the same voice channel as mine");  
    if (message.guild.queue.playing) {
      message.guild.queue.playing = false;
      message.guild.queue.connection.dispatcher.pause();
      return message.channel.send(createEmbed().setDescription(":pause_button: **|** Paused the music for you").setColor("BLUE"));
    }
    message.channel.send(createEmbed().setDescription("Music is already paused").setColor("YELLOW"));
  }
}