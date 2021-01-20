import Auth from "./lib/auth";
import Client from "./client";
import { discordToken } from "./util/env";
import CommandServerStatus from "./commands/minecraft/CommandServerStatus";
import { Message } from "discord.js";
import { TextChannel } from "discord.js";
import requestServer from "./util/ServerRequest";

export class Main {
  // private static auth: Auth;
  private static client: Client;

  static async start(): Promise<void> {
    this.client = new Client();
    try {
      await this.client.ManifestHandler.pullManifest();
      this.client.login(discordToken);
    } catch (e) {
      console.log(e);
    }
    this.client.on("ready", async () => {
      this.client.logger.debug(`[FORTNITE] Build Version: ${this.client.ManifestHandler.build}`);
      this.client.logger.info("Bot has started");
      this.client.logger.info("Guilds: " + await this.client.getGuildsCount());
      this.client.user.setPresence({ activity: { name: "with Pixels | pixel.wtf", type: "PLAYING" }, status: "online" });
      const channel = this.client.channels.cache.find(channel => channel.id == "801256672265502720") as TextChannel;
      if (process.env.NODE_ENV === "production"){
        requestServer("ottocraft.qpixel.me", this.client.logger, null, channel);
        setInterval(() => {
          requestServer("ottocraft.qpixel.me", this.client.logger, null, channel);
        }, 120000);
      }
    });
  }
}
Main.start();
