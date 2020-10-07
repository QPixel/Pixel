import { MessageEmbed, EmbedField, MessageEmbedImage } from "discord.js";
export default function createEmbed(data?: IEmbed): MessageEmbed {
  return new MessageEmbed(data)
    .setTimestamp()
    .setFooter("Pixel, a discord bot. made by QPixel");
}

interface IEmbed {
  title: string;
  fields?: EmbedField[],
  color?: number,
  image?: MessageEmbedImage | null;
}