import Command from "../../structures/BaseCommand";
import { Message } from "discord.js";
import axios from "axios";
import createEmbed from "../../util/CreateEmbed";

export default class CommandGetAes extends Command {
  constructor () {
    super("aes", {
      aliases: [ "getaes", "aes" ],
      args: [
        {
          id: "dynamicAes",
          type: "boolean",
          default: true,
        }
      ]
    });
  }

  async exec(message: Message, args: Record<string, string>): Promise<Message> {
    const buildNumber = this.client.ManifestHandler.buildnumber;
    let aes: string;
    try {
      aes = (await axios.get("https://fnbot.shop/api/aes")).data;
    } catch (e) {
      console.error(e);
      aes = "Fnbot.shop was down... Main Aes was not able to be fetched";
    }

    if (args.dynamicAes) {
      const dynamicAes: Record<string, string> = await axios
        .get("https://benbotfn.tk/api/v1/aes")
        .then((response) => {
          return response.data.dynamicKeys;
        })
        .catch((_error) => {
          console.error(_error);
          return { Error: "Benbot was down.... Dynamic keys were not fetched" };
        });
      const embed = createEmbed({ title: `${buildNumber} Aes Keys` });
      embed.addField("Main Key",  `\`0x${aes}\``);
      try {
        Object.entries(dynamicAes).forEach(([ key, value ]) => {
          const replaceKey = key.replace("FortniteGame/Content/Paks/", " ").replace("-WindowsClient.pak", " ");
          embed.addField(replaceKey + ":", "``" + value + "``");
        });
      } finally {
        message.channel.send({ embed });
      }
    } else {
      const embed = createEmbed({ title: `${buildNumber} Aes Key` });
      embed.addField("Main Key",  `\`0x${aes}\``);
      return message.channel.send(embed);
    }

  }
} 