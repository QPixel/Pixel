import Auth from "./lib/auth";
import Client from "./client";
import { discordToken } from "./util/env";
import ManifestHandler from "./util/Manifest";
import ShopHandler from "./lib/ShopHandler";

export class Main {
  private static auth: Auth;
  private static client: Client;
  private static Manifest: ManifestHandler;
  public static Shop: ShopHandler;

  static async start(): Promise<void> {
    this.client = new Client();
    this.Manifest = new ManifestHandler();
    this.Shop = new ShopHandler();
    try {
      this.auth = new Auth(this.client.logger, "normalStartUp");
      await this.Manifest.pullManifest();
      this.client.login(discordToken);
      this.client.logger.debug(`[FORTNITE] Build Version: ${this.Manifest.build}`);
    } catch (e) {
      console.log(e);
    }
    this.client.on("ready", async () => {
      this.client.logger.info("Bot has started");
      this.client.logger.info("Guilds: " + await this.client.getGuildsCount());
      this.client.user.setPresence({ activity: { name: "with Pixels | pixel.wtf", type: "PLAYING" }, status: "online" });
    });
  }
}
Main.start();
