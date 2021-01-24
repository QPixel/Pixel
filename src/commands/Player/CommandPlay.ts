/* eslint-disable no-useless-escape */
import Command from "../../structures/BaseCommand";
// import { VoiceConnection } from "discord.js";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IGuild, IMessage, ISong } from "structures/commoninterfaces";
import ytdl from "ytdl-core";
import ytdldiscord from "ytdl-core-discord";
import { search } from "yt-search";
import type { videoInfo } from "ytdl-core";
import { VoiceChannel } from "discord.js";
import ServerQueue from "../../structures/ServerQueue";

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
    // if (!message.guild.me.voice.channel) {
    //   message.channel.send(":speaker: Joining Channel " + "``" + message.guild.channels.cache.get(message.member.voice.channelID).name + "``" + " :speaker:");
    //   connect = await voiceChannel.join();
    //   await connect.voice.setSelfDeaf(true);
    // }
    if (message.guild.queue !== null && voiceChannel.id !== message.guild.queue.voiceChannel.id) {
      return message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription(`Music on this server is already playing on: **\`${message.guild.queue.voiceChannel.name}\`** voice channel`).setColor("YELLOW"));
    }
    let songInfo;
    if (args.searchquery.match(ytlink)) {
      try {
        songInfo = await ytdl.getInfo(args.searchquery);
      } catch (e) {
        return message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription("I could not resolve this youtube url.").setAuthor("RED"));
      }
    } else {
      try {
        const results = await search(args.searchquery);
        // const msg = await message.channel.send(createEmbed({ title: "Pixel Music" }).setAuthor("Song Selection").setDescription(`\`\`\`\n${results.map(video => `${++index} - ${this.cleanTitle(video.title)}`).join("\n")}\`\`\`\n` +
        //                 "Please provide a value to select one of the search results ranging from **\`1-10\`**!").setColor("BLUE").setFooter("• Type cancel or c to cancel the song selection"));
        songInfo = await ytdl.getInfo(results.videos[0].url);
      } catch (e) {
        console.error(e);
        return message.reply("Could not find the video on youtube");
      }
    }
    return this.handleVideo(songInfo, message, voiceChannel);
  }
  private async handleVideo(video: videoInfo, message: IMessage, voiceChannel: VoiceChannel, playlist = false): Promise<any> {
    const song: ISong = {
      id: video.videoDetails.videoId,
      title: video.videoDetails.title,
      url: video.videoDetails.video_url
    };

    if (message.guild.queue) {
      if (message.guild.queue.songs.find(s => s.id === song.id)) {
        return message.channel.send(createEmbed({ title: "Pixel Music" }).setColor("YELLOW").setDescription(`**[${song.title}](${song.id})** is already queued, and this bot configuration disallow duplicated song in queue, ` +
                "please use **`^repeat`** instead"));
      }
      message.guild.queue.songs.addSong(song);
      if (playlist) return;
      message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription(`✅  **|**  **[${song.title}](${song.url})** has been added to the queue!`).setColor("BLUE"));
    } else {
      message.guild.queue = new ServerQueue(message.channel, voiceChannel);
      message.guild.queue.songs.addSong(song);
      try {
        const connection = await message.guild.queue.voiceChannel.join();
        message.guild.queue.connection = connection;
      } catch (e) {
        message.guild.queue.songs.clear();
        message.guild.queue = null;
        console.error(e);
        message.channel.send(createEmbed({ title: "Pixel Music" }).setDescription(`Error: Could not join the voice channel, because:\n\`${e}\``).setColor("RED"));
        return undefined;
      }
      this.play(message.guild).catch(err => {
        console.error(err);
      });
    }
    return message;
  }
  private async play(guild: IGuild) : Promise<any> {
    const serverQueue = guild.queue;
    const song = serverQueue.songs.first();
    if (!song) {
      serverQueue.textChannel.send(createEmbed({ title: "Pixel Music" }).setDescription(`⏹  **|**  Queue has finished, use **\`${guild.client.config.prefix}play\`** again to play more songs!`).setColor("BLUE"));
      serverQueue.connection.disconnect();
      return guild.queue = null;
    }
    serverQueue.connection?.voice?.setSelfDeaf(true);
    const songData = await ytdldiscord(song.url, { highWaterMark: 1 << 25 });
    const streamtype = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

    serverQueue.connection.play(songData, { type: streamtype, bitrate: "auto", highWaterMark: 1 }).on("start", () => {
      serverQueue.playing = true;
      this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Song: "${song.title}" on ${guild.name} has started`);
      serverQueue.textChannel.send(createEmbed({ title: "Pixel Music" }).setDescription(`▶  **|**  Start playing: **[${song.title}](${song.url})**`).setColor("BLUE"));
    }).on("finish", () => {
      this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids}]` : ""} Song: "${song.title}" on ${guild.name} has ended`);
      if (serverQueue.loopMode === 0) {serverQueue.songs.deleteFirst();} else if (serverQueue.loopMode === 2) {serverQueue.songs.deleteFirst; serverQueue.songs.addSong(song);}
      this.play(guild).catch(e => {
        serverQueue.textChannel?.send(createEmbed({ title: "Pixel Music" }).setDescription(`Error while trying to play music:\n\`${e}\``).setColor("RED"));
        serverQueue.connection?.dispatcher.end();
        return undefined;
      });
    }).on("error", (err: Error) => {
      console.error(err);
    });
  }
}