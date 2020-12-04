import Auth from "./lib/auth";
import Client from "./client";
import { discordToken } from "./util/env";

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
    });
  }
}
Main.start();
