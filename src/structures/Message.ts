import Client from "client";
import { Message as DiscordMessage } from "discord.js";

export default class Message extends DiscordMessage {
  client: Client;
} 