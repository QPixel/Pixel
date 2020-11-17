import { Command } from "discord-akairo";
import { Message } from "discord.js";
import createEmbed from "../../util/CreateEmbed";
import { IMessage } from "typings";

export default class CommandQueue extends Command {
  public constructor () {
    super("queue", {
      aliases: [ "queue", "q" ],
      category: "Player"
    });
  }
  public exec(messsage: IMessage): Promise<void | Message> {
    if (!messsage.guild.queue) return messsage.channel.send(createEmbed({ title: "Pixel Music" }).setDescription("There is nothing playing").setColor("YELLOW"));
    
    const embed = createEmbed({ title: ":hourglass_flowing_sand: Song Queue" }).setColor("BLUE");

    let num = 1;
    const songs = messsage.guild.queue.songs.map(s => `${num++} - ${s.title}`);
    if (messsage.guild.queue.songs.size > 10) {
      const indexes: string[] = this.chunk(songs, 10);
      let index = 0;
      embed.setDescription(`\`\`\`\n${indexes[index]}\`\`\``).setFooter(`• Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
      messsage.channel.send(embed).then(msg => {
        msg.react(":arrow_backward:").then(() => {
          msg.react("arrow_forward");
          msg.createReactionCollector((reaction, user) => reaction.emoji.name === ":arrow_backward:" && user.id === messsage.author.id, { time: 80 * 1000 }).on("collect", () => {
            if (index === 0) return undefined;
            index--;
            embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
            msg.edit(embed);
          });
          msg.createReactionCollector((reaction, user) => reaction.emoji.name === ":arrow_forward:" && user.id === messsage.author.id, { time: 80 * 1000 }).on("collect", () => {
            if (index === 0) return undefined;
            index++;
            embed.setDescription(indexes[index]).setFooter(`Page ${index + 1} of ${indexes.length}`, "https://hzmi.xyz/assets/images/390511462361202688.png");
            msg.edit(embed);
          });
        });
      });
    } else {
      messsage.channel.send(embed.setDescription(songs.join("\n")));
    }
  }
  private chunk(array: Array<any> | string, chunkSize: number): Array<any> {
    const temp = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      temp.push(array.slice(i, i + chunkSize));
    }
    return temp;
  }
}