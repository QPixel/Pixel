import Auth from "./lib/auth";
import fs from "fs";
import Client from "./client";
import { discordToken } from "./util/env";
import ManifestHandler from "./util/Manifest";
const fsPromises = fs.promises;

class Main {
  private static auth: Auth;
  private static client: Client;
  private static Manifest: ManifestHandler;
  static async start() {
    this.client = new Client();
    this.Manifest = new ManifestHandler();
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
    });
  }
}
Main.start();
