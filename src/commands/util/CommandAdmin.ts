import beautify from "json-beautify";
import { performance } from "perf_hooks";
import { Message } from "discord.js";
import { Command } from "discord-akairo";
import { type } from "os";
import { create } from "domain";
import createEmbed from "util/CreateEmbed";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const shell = require("shelljs");


export default class CommandAdmin extends Command {
  constructor () {
    super("admin", {
      aliases: [ "admin" ],
      ownerOnly: true,
      category: "Util",
      args: [
        {
          id: "cmd",
          type: "string"
        },
        {
          id: "option",
          type: "string"
        },
        {
          id: "extraParams",
          type: "string"
        },
        {
          id: "evenMoreParams",
          type: "string"
        }
      ]
    });
  }
  async exec(message: Message, args: Record<string, string>): Promise<Message> {
    // if (!command.member.roles.cache.get('243512667610939394')) {
    //   return command.reply('You do not have permission to use this command.');
    // }
    function measure(fn: () => void): number {
      const start = performance.now();
      fn();
      return performance.now() - start;
    }
    const { cmd, subCMD, extraParams, extra2 } = args;
    if (cmd === "restart-bot") {
      message.channel.send(":repeat: Restarting Bot");
      shell.exec("pm2 restart 0", function (code: string, output: string) {
        console.log("Restarting exit code: " + code);
        console.log("Please dont frick up");
        console.log("OUTPUT: " + output);
      });
    } else if (cmd === "cmd") {
      return message.channel.send(":stop_sign: This Command is currently disabled...");
      //const fullCMD = subCMD + ' ' + extraParams;
      // let fullCMD: string;
      // if (subCMD === "" || null || undefined) {
      //   return message.reply("Check your sub cmd. It seems blank.");
      // }
      // if (!(typeof extraParams === "undefined") && !extraParams === null) {
      //   fullCMD = subCMD + " " + extraParams;
      // } else {
      //   fullCMD = subCMD;
      // }
      // if (!(typeof extra2 === "undefined") && !extra2 === null ) {
      //   fullCMD = fullCMD + " " + extra2;
      // } // else {
      // // }
      // console.log(fullCMD);
      // message.channel.send(":repeat: Evauluating Command...");
      // const durations = measure(() => {
      //   shell.exec(fullCMD, { silent: true }, (code: number, output: string, error: any) => {
      //     if (error !== "") {
      //       message.channel.send("```js\n" + error + "```");
      //     } else {
      //       message.channel.send("```js\n" + output + "```");
      //     }
      //   });
      // });
      // setTimeout(() => {
      //   return message.channel.send(`Command was evaluated in ${durations.toFixed(3)}s`);
      // }, 35);
    } else if (cmd === "list-commands") {
      const commands = this.handler.modules;
      const commandList: Array<string> = [];
      commands.keyArray().forEach((element, i) => {
        commandList[i] = element;
      });
      const durations = measure(() => {
        message.channel.send("```json\n" + beautify(commandList, null, 1, 70) + "```");
      });
      return message.channel.send(`Command was evauluated in ${durations.toFixed(3)}s`);
    // } else if (cmd === "reload-command") {
    } else if (cmd === "stop-pm2") {
      message.channel.send(":octagonal_sign: Stopping Bot");
      shell.exec("pm2 stop 0", function (code: string, output: string) {
        console.log("Restarting exit code: " + code);
        console.log("Please dont frick up");
        console.log("OUTPUT: " + output);
      });
    } else if (cmd === "disable") {
      return message.reply("Remind me to add logic for this command");
    } else if (cmd === "stop") {
      message.reply(":octagonal_sign: Stopping Bot").then(() => {
        process.exit();
      });
      // } else if (cmd === "echo") {
      //   const echoMessage = createEmbed({title: "Echo"});
      //   for (let i = 3; i < args.length) {
        
    //   }
    } else {
      return message.channel.send("Please send a proper sub-command");
    }
  }
}
