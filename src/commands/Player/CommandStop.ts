import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class CommandStop extends Command {
  constructor() {
    super("stop", {
      aliases: [ "stop", "player-stop" ],
      category: "Player",
    });
  }
  exec(message: Message): void {
    message.guild.me.voice.channel.leave();
    message.channel.send(":stop_sign: Player has stopped and left the voice channel.");
  }
}