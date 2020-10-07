import { Command } from "discord-akairo";
import { Message, StreamDispatcher } from "discord.js";
import { join } from "path";
import fs from "fs";


export default class CommandJoinVC extends Command {
  public dispatcher: StreamDispatcher;
  constructor () {
    super("joinvc", {
      aliases: [ "joinvc" ],
      category: "Player",
      args: [
        {
          id: "specialPlay",
          type: "string",
          default: ""
        }
      ]
    });
  }
  async exec(message: Message, args: Record<string, string>): Promise<void | Message> {
    // const serverQueue = message.client.queue.get(message.guild.id);
    if (!message.member.voice.channel)
      return message.reply("You're not in a channel. :stop_sign:");
    if (!message.guild.me.voice.channel)
      message.channel.send(":speaker: Joining Channel " + "``" + message.guild.channels.cache.get(message.member.voice.channelID).name + "``" + " :speaker:");
    const connect = await message.member.voice.channel.join();
     await connect.voice.setSelfDeaf(true);
    if (args.specialPlay.toLowerCase() === "seasonx") {
      this.dispatcher = connect.play(fs.createReadStream("seasonx.mp3"));
    } else {
      this.dispatcher = connect.play(fs.createReadStream("output.ogg"));
    }
    this.dispatcher.on("start", () => {
      console.log("Audio has started playing");
    });
    this.dispatcher.on("stop", () => {
      console.log("Audio has finished playing");
      connect.disconnect();
    });
    this.dispatcher.on("error", console.error);
    message.reply("Player has started :loud_sound:");
  }
}