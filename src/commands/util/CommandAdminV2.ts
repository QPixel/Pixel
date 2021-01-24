import { performance } from "perf_hooks";
import { IMessage } from "structures/commoninterfaces";
import { Message } from "discord.js";
import BaseCommand from "../../structures/BaseCommand";
import createEmbed from "util/CreateEmbed";


export default class CommandAdminV2 extends BaseCommand {
  constructor () {
    super("adminv2", {
      aliases: [ "adminv2" ],
      ownerOnly: true,
      category: "Util",
      args: [
        {
          id: "cmd",
          type: "string"
        },
        {
          id: "extra",
          type: "string"
        }
      ]
    });
  }
  async exec(message: IMessage, args: {cmd: string, extra: string}): Promise<Message| void> {
    console.log(args);
    const measure = (fn: () => void): number => {
      const start = performance.now();
      fn();
      return performance.now() - start;
    };
    switch (args.cmd) {
    case "cmd": {
      console.log("Hello");
    }
    }
  }
}