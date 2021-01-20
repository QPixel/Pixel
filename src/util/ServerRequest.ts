import { TextChannel } from "discord.js";
import { status } from "minecraft-server-util";
import { Message, Channel } from "discord.js";
import { Logger } from "winston";
import createEmbed from "./CreateEmbed";

export default async function requestServer(serverIP: string, logger: Logger, message?: Message, channel?: TextChannel): Promise<Message> {
  // const request = await axios.get(`http://mcapi.us/server/status?ip=${serverIP}`).then((res) => {return res.data;}).catch(err => logger.error("Could not get server. Error: " + err)) as ServerRequest;
  const serverstatus = await status(serverIP).catch(() => {
    if (channel) {
      setTimeout(() => {
        channel.client.users.cache.get("218072060923084802").send("<21807206092308480299> SERVER IS DOWN");
      },1000);
      channel.send("<2180720609230848029> SERVER IS DOWN!! CHECK LOGS");
    } else if (message) {
      setTimeout(() => {
        message.client.users.cache.get("218072060923084802").send(`${message.author} SERVER IS DOWN`);
      },3000);
      if (message.channel.type !== "dm")
      {
        message.channel.send(`${message.author} SERVER IS DOWN!! CHECK LOGS`);
      }
    } else {
      return;
    }
  });
  if (serverstatus) {
    // logger.error("There was ana error or something i'm not sure llmfao");
    if (channel) {
      const embed = createEmbed({ title: "MC Server Status", color: "#116881" });
      embed.addFields([ 
        { 
          name: "Status:", 
          value: "online", 
          inline: true 
        }, 
        { 
          name: "Players Online:", 
          value: "**" + serverstatus.onlinePlayers + "** / **" + serverstatus.maxPlayers + "**", 
          inline: true 
        },
      ]);
      embed.setFooter(`IP: ${serverIP}`);
      return channel.send({ embed });
    } else {
      const embed = createEmbed({ title: "MC Server Status", color: "#116881" });
      embed.addFields([ 
        { 
          name: "Status:", 
          value: "online", 
          inline: true 
        }, 
        { 
          name: "Players Online:", 
          value: "**" + serverstatus.onlinePlayers + "** / **" + serverstatus.maxPlayers + "**", 
          inline: true 
        },
      ]);
      embed.setFooter(`IP: ${serverIP}`);
      return message.channel.send({ embed }); 
    }
  }    
};