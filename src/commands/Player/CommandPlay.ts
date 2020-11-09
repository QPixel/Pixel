import { Command } from "discord-akairo";
import { VoiceConnection } from "discord.js";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IGuild, IMessage } from "typings";
import ytdl from "ytdl-core";
import ytdldiscord from "ytdl-core-discord";


export default class CommandPlay extends Command {
  public constructor () {
    super("play", {
      aliases: [ "play", "p", "play-music" ],
      category: "Player",
      args: [
        {
          id: "searchquery",
          type: "string",
          default: "help",
          match: "content",
        }
      ]
    });
  } 
  async exec(message: IMessage, args: {searchquery: string;}): Promise<void | Message> {
    const voiceChannel = message.member.voice.channel;
    let connect;
    // eslint-disable-next-line no-useless-escape
    const ytlink = "^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$";
    if (!voiceChannel) 
      return message.reply("You're not in a voice channel. :stop_sign:");
    if (!voiceChannel.joinable)
      return message.reply("I cannot connect your voice channel, please make sure I have the proper permissions!");
    if (!voiceChannel.speakable)
      return message.reply("Unable to speak in in voice channel, please make sure I have the proper permissions!");
    if (!args.searchquery) 
      return message.reply("Invalid arguments");
    if (!message.guild.me.voice.channel) {
      message.channel.send(":speaker: Joining Channel " + "``" + message.guild.channels.cache.get(message.member.voice.channelID).name + "``" + " :speaker:");
      connect = await voiceChannel.join();
      await connect.voice.setSelfDeaf(true);
    }

    if (message.guild.queue !== null && voiceChannel.id !== message.guild.queue.voiceChannel.id) {
      return message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription(`Music on this server is already playing on: **\`${message.guild.queue.voiceChannel.name}\`** voice channel`).setColor("YELLOW"));
    }

    // if (ytlink.match(ytlink)) {
    //   try {
    //     const
    //   }
    // }
  }

  private async play(guild: IGuild) : Promise<any> {
    const serverQueue = guild.queue;
    const song = serverQueue.songs.first();
    
    if (!song) {
      serverQueue.textChannel.send(createEmbed({ title: "Pixel Music" }).setDescription(`⏹  **|**  Queue has finished, use **\`${guild.client.config.prefix}play\`** again to play more songs!`).setColor("BLUE"));
      serverQueue.connection.disconnect();
      return guild.queue = null;
    }
    
    const songData = await ytdldiscord(song.url);
    serverQueue.connection.play();
  }
}