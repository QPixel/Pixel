import axios from "axios";
import { TextChannel } from "discord.js";
import { Message, Channel } from "discord.js";
import { Logger } from "winston";
import createEmbed from "./CreateEmbed";

export default async function requestServer(serverIP: string, logger: Logger, message?: Message, channel?: TextChannel): Promise<Message> {
  const request = await axios.get(`http://mcapi.us/server/status?ip=${serverIP}`).then((res) => {return res.data;}).catch(err => logger.error("Could not get server. Error: " + err)) as ServerRequest;
  if (channel) {
    if (request.online == false || request.online == null) {
      channel.send("@QPixel SERVER IS DOWN!! CHECK LOGS");
    }

    const embed = createEmbed({ title: "MC Server Status", color: "#116881" });
    embed.addFields([ 
      { 
        name: "Status:", 
        value: request.status, 
        inline: true 
      }, 
      { 
        name: "Players Online:", 
        value: "**" + request.players.now + "** / **" + request.players.max + "**", 
        inline: true 
      },
    ]);
    embed.setFooter(`IP: ${serverIP}`);
    return channel.send({ embed });
  } else {
    if (request.online == false || request.online == null) {
      message.channel.send("@QPixel SERVER IS DOWN!! CHECK LOGS");
    }

    const embed = createEmbed({ title: "MC Server Status", color: "#116881" });
    embed.addFields([ 
      { 
        name: "Status:", 
        value: request.status, 
        inline: true 
      }, 
      { 
        name: "Players Online:", 
        value: "**" + request.players.now + "** / **" + request.players.max + "**", 
        inline: true 
      },
    ]);
    embed.setFooter(`IP: ${serverIP}`);
    return message.channel.send({ embed }); 
  }
};

interface ServerRequest {
  status: string;
  online: boolean;
  motd: string;
  favicon: unknown;
  error: unknown;
  players: {
    max: number;
    now: number;
    sample: Array<Record<string, string>>
  };
  server: {
    name: string;
    protocol: number;
  };
  last_updated: string;
  last_online: string;
  duration: number;
}