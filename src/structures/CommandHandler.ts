import { Category, CommandHandler as AkairoCommandHandler, CommandHandlerOptions, Constants } from "discord-akairo";
import Client from "../client";
import { Collection } from "discord.js";
import Command from "./BaseCommand";

const { CommandHandlerEvents } = Constants;

export default class CommandHandler extends AkairoCommandHandler {
  categories: Collection<string, Category<string, Command>>;
  modules: Collection<string, Command>;
  client: Client;
  
  constructor (client: Client, options: CommandHandlerOptions) {
    super(client, options);
  }

  /**
   * Custom implimentation of runCommand
   */
  async runCommand(message) {

  }
} 