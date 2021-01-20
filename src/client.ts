import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Collection } from "discord.js";
import { prefix } from "./util/env";
import { join } from "path";
// import * as config from "./util/Config";
import { createLogger } from "./util/Logger";

import "./structures/Guild";
import { Logger } from "winston";
import ShopHandler from "./lib/ShopHandler";
import Auth from "./lib/auth";
import ManifestHandler from "./util/Manifest";

export default class Client extends AkairoClient {
  public commandHandler: CommandHandler;
  public listenerHandler: ListenerHandler;
  // public readonly config = config;
  public readonly logger = createLogger("Pixel", false);
  public ShopHandler: ShopHandler;
  public ManifestHandler: ManifestHandler;
  public auth: Auth;
  // public queue: Map<string, unknown>
  constructor () {
    super({
      ownerID: "218072060923084802"
    }, {
      disableMentions: "everyone"
    });
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, "./commands/"),
      prefix: prefix,
      extensions: [ ".ts" , ".js" ]
    });
    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, "./listeners/")
    });
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.loadAll();
    this.commandHandler.loadAll();
    this.auth = new Auth(this.logger, "normalStartUp");
    this.ShopHandler = new ShopHandler(this.auth, this.logger);
    this.ManifestHandler = new ManifestHandler(this.auth);
  }

  public async getGuildsCount(): Promise<number> {
    if (!this.shard) return this.guilds.cache.size;
    const size = await this.shard.broadcastEval("this.guilds.cache.size");
    return size.reduce((p, v) => p + v, 0);
  }

  public async getChannelsCount(filter = true): Promise<number> {
    if (filter) {
      if (!this.shard) return this.channels.cache.filter(c => c.type !=="category" && c.type !== "dm").size;
      const size = await this.shard.broadcastEval("this.channels.cache.filter(c => c.type !== 'category' && c.type !== 'dm).size");
      return size.reduce((p, v) => p + v, 0);
    }

    if (!this.shard) return this.channels.cache.size;
    const size = await this.shard.broadcastEval("this.channels.cache.size");
    return size.reduce((p, v) => p + v, 0);
  }
  public async getUsersCount(filter = true): Promise<number> {
    const temp = new Collection();
    if (filter) {
      if (!this.shard) return this.users.cache.filter(u => !u.equals(this.user!)).size;
      const shards = await this.shard.broadcastEval("this.users.cache.filter(u => !u.equals(this.user))");
      for (const shard of shards) { for (const user of shard) { temp.set(user.id, user); } }
      return temp.size;
    }
    if (!this.shard) return this.users.cache.size;
    const shards = await this.shard.broadcastEval("this.users.cache");
    for (const shard of shards) { for (const user of shard) { temp.set(user.id, user); } }
    return temp.size;
  }

  public async getTotalPlaying(): Promise<number> {
    if (!this.shard) return this.guilds.cache.filter((g: any) => g.queue !== null && g.queue.playing === true).size;
    return this.shard.broadcastEval("this.guilds.cache.filter(g => g.queue !== null && g.queue.playing === true).size").then(data => data.reduce((a, b) => a + b));
  }

  public async getTotalMemory(type: keyof NodeJS.MemoryUsage): Promise<number> {
    if (!this.shard) return process.memoryUsage()[type];
    return this.shard.broadcastEval(`process.memoryUsage()["${type}"]`).then(data => data.reduce((a, b) => a + b));
  }
};