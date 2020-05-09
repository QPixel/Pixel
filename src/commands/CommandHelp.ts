import { prefix } from './../util/env';
import { Command, CommandMessage, Client, Discord } from '@typeit/discord';
import { ReactionCollector, MessageEmbed } from 'discord.js';

@Discord({ prefix: prefix })
export class CommandHelp {
  @Command('help', { description: 'Gives you help' })
  async help(command: CommandMessage, client: Client) {
    const embed = new MessageEmbed()
      .setColor('0099ff')
      .setTitle('Help')
      .setDescription(`Page **1** of 2`)
      .setFooter('FNMultibot, made by QPixel')
      .setTimestamp();
    // console.log(client);
    command.channel.send(embed);
  }
}
