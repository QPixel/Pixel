import { Command } from "discord-akairo";
import { Message } from "discord.js";
import { IMessage } from "structures/commoninterfaces";

export default class CommandStop extends Command {
  constructor() {
    super("stop", {
      aliases: [ "stop", "player-stop", "leave", "dc" ],
      category: "Player",
    });
  }
  exec(message: IMessage): Promise<void | Message>  {
    if (!message.member.voice.channel) return message.reply("You're not in a voice channel");
    if (!message.guild.queue) return message.reply("There is nothing playing");
    if (message.member.voice.channel.id !== message.guild.queue.voiceChannel.id) return message.reply("You need to be in the same voice channel as mine");
    
    message.guild.me.voice.channel.leave();
    message.guild.queue = null;
    message.channel.send(":stop_sign: Player has stopped and left the voice channel.");
  }
}