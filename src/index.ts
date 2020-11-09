import Auth from "./lib/auth";
import fs from "fs";
import Client from "./client";
import { discordToken } from "./util/env";
import ManifestHandler from "./util/Manifest";
import ShopHandler from "./lib/ShopHandler";
const fsPromises = fs.promises;

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
      this.auth = new Auth("normalStartUp");
      await this.Manifest.pullManifest();
      console.log(this.Manifest.build);
      this.client.login(discordToken);
    } catch (e) {
      console.log(e);
    }
    this.client.on("ready", () => {
      console.log("Pixel has started.");
      this.client.user.setPresence({ activity: { name: "with Pixels | pixel.wtf", type: "PLAYING" }, status: "online" });
    });
  }
}
Main.start();
