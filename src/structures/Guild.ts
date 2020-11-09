import { Structures } from "discord.js";
import Client from "../client";
import { IGuild, IServerQueue } from "../../typings";
Structures.extend("Guild", dJSGuild => class Guild extends dJSGuild implements IGuild {
  public client!: IGuild["client"];
  public queue: IServerQueue | null = null;
  public constructor(client: Client, data: Guild) {super(client,data);}
});