import { discordToken, prefix } from './util/env';
import 'reflect-metadata';
import { Discord, Client, Guard, Prefix, CommandMessage, Command, CommandNotFound } from '@typeit/discord';
//import { RichEmbed, MessageEmbed } from 'discord.js';\
// import { RichEmbed } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import axios from 'axios';
import Endpoints from './util/endpoints';
import * as Auth from './lib/auth';
import { NotBot } from './guards/NotBot';
import beautify from 'json-beautify';
import os from 'os';
import { Embeds, FieldsEmbed, IClientAssets } from 'discord-paginationembed';
import fs, { readFile } from 'fs';
enum Answers {
  hello = 'Hello',
  notFound = 'Command not found...',
  prefix = 'Prefix changed',
}
export async function pullManifest() {
  const token = await Auth.launcherAuth();
  const headers: any = {};
  headers['X-EpicGames-Lanuage'] = 'en';
  headers['Authorization'] = 'bearer ' + token;
  const requester = axios.create({
    headers: headers,
    responseType: 'json',
  });
  const manifestreq = (await requester.get(Endpoints.MANIFEST)).data.items.MANIFEST.path;
  const buildreq = (await requester.get(Endpoints.MANIFEST)).data.buildVersion;
  // let manifest,build,buildNumber;
  const manifest: string = manifestreq.toString().replace('Builds/Fortnite/CloudDir/', '').replace('.manifest', '');
  const build: string = buildreq.toString().split('++Fortnite+Release-').join('\n');
  const buildNumber: string = build.slice(0, 6);
  return [manifest, build, buildNumber];
}
let manifest: string;
let build: string;
let buildNumber: string;
const buildPath = `${__dirname}/buildInfo.json`;
async function parseManifest() {
  const values: string[] = await pullManifest();
  manifest = values[0];
  build = values[1];
  buildNumber = values[2];
  return {
    manifest: values[0],
    build: values[1],
    buildNumber: values[2],
  };
}
async function setupCompareCache() {
  const buildInfo = await parseManifest();
  try {
    fs.writeFileSync(buildPath, JSON.stringify(buildInfo));
  } catch (error) {
    console.error(error);
  }
}
async function changeCache() {
  const buildInfo = await parseManifest();
  try {
    fs.writeFileSync(buildPath, JSON.stringify(buildInfo));
  } catch (error) {
    console.error(error);
  }
}
@Discord({ prefix: prefix })
export class DiscordBot {
  aesCompare: string;
  private static _client: Client;
  static get Client(): Client {
    return this._client;
  }
  static async start() {
    await setupCompareCache();
    this._client = new Client();
    this._client.on('ready', () => {
      console.log('Connected as ' + this._client.user.tag);
      this._client.user.setStatus('online');
      this._client.user.setActivity(buildNumber, { type: 'PLAYING' });
    });
    this._client.login(discordToken, `${__dirname}/commands/*.js`);

    console.log(Client.getCommands());
  }
  @Guard(NotBot, Prefix('?', true))
  @Command('hello', {
    description: 'Says Hello',
  })
  hello(command: CommandMessage) {
    command.reply(Answers.hello);
  }
  @Command('getAes', {
    description: 'Gets current aes',
  })
  async getAes(command: CommandMessage) {
    const aes = await axios
      .get('https://fnbot.shop/api/aes')
      .then((response) => {
        return response.data;
      })
      .catch((_error) => {
        console.log(_error);
        return { Error: 'Fnbot.Shop was down... Main Aes was not fetched' };
      });
    const dynamicAes: any = await axios
      .get('https://benbotfn.tk/api/v1/aes')
      .then((response) => {
        return response.data.dynamicKeys;
      })
      .catch((_error) => {
        console.error(_error);
        return { Error: 'Benbot was down.... Dynamic keys were not fetched' };
      });
    const embed = new MessageEmbed()
      .setTitle(buildNumber + ' Aes Keys')
      .setColor('#0099ff')
      .addField('Main Key', `\`0x${aes}\``)
      .setTimestamp()
      .setFooter('FNMultibot, made by QPixel');
    try {
      Object.entries(dynamicAes).forEach(([key, value]) => {
        // eslint-disable-next-line prefer-const
        let replaceKey = key.replace('FortniteGame/Content/Paks/', ' ');
        embed.addField(replaceKey + ':', '``' + value + '``');
      });
    } catch (error) {
      throw error;
    } finally {
      command.channel.send({ embed });
    }
  }
  @Command('manifest', {
    description: 'Gets Current manifest',
    commandCaseSensitive: false,
  })
  manifest(command: CommandMessage) {
    const embed = new MessageEmbed()
      .setTitle('Fortnite INFO')
      .setColor('#0099ff')
      .addField('Current Manifest', '- ' + manifest)
      .addField('Current Build', '- ' + '++Fortnite+Release-' + build)
      .setTimestamp()
      .setFooter('Pixel, a discord bot. made by QPixel');
    command.channel.send(embed);
  }

  @Command('updateMode', {
    description: 'Puts the bot into update mode',
    commandCaseSensitive: false,
  })
  async updateMode(command: CommandMessage) {
    await parseManifest();
    const x = JSON.parse(fs.readFileSync(buildPath, 'utf8').toString());
    if (x.build === build) {
      command.reply('No new updates');
    } else {
      command.reply('Starting Update mode');
      await command.reply('Manifest and build have been updated').then(() => {
        this.manifest(command);
      });

      await command.reply('Getting Aes').then(() => {
        this.getAes(command);
      });
      command.client.user.setActivity(buildNumber, { type: 'PLAYING' });
      await changeCache();
    }
  }

  @Command('checkStaging', {
    description: "Checks Epic's staging servers",
  })
  async checkStaging(command: CommandMessage) {
    const res = await axios.get(Endpoints.STAGING_API).then((response) => {
      return response;
    });
    const embed = new MessageEmbed()
      .setTitle('Fortnite INFO')
      .setColor('#0099ff')
      .setDescription('RESPONSE was ' + res.status)
      .addField('Server Date', '```' + res.data.serverDate + '```')
      .addField('cln', '```' + res.data.cln + '```')
      .addField('Build', '```' + res.data.build + '```')
      .addField('Version', '```' + res.data.version + '```')
      .addField('Branch', '```' + res.data.branch + '```')
      .setTimestamp()
      .setFooter('Pixel, a discord bot. made by QPixel');
    command.channel.send(embed);
  }
  @Command('fortniteStatus', {
    description: 'Checks if fortnite is up',
  })
  async fortniteStatus(command: CommandMessage) {
    const res = await axios.get(Endpoints.LIGHT_SWITCH).then((response) => {
      return response;
    });
    const embed = new MessageEmbed()
      .setTitle('Fortnite INFO')
      .setColor('#0099ff')
      .setDescription('RESPONSE was ' + res.status)
      .addField('status', '```' + res.data[0].status + '```')
      .addField('message', '```' + res.data[0].message + '```')
      .setTimestamp()
      .setFooter('Pixel, a discord bot. made by QPixel');
    command.channel.send(embed);
  }
  @Command('isFortniteDown', {
    description: 'Is it?',
  })
  async isFortniteDown(command: CommandMessage) {
    const res = await axios.get(Endpoints.LIGHT_SWITCH).then((response) => {
      return response.data[0].status;
    });
    if (res === 'DOWN') {
      command.reply('Yes');
    } else {
      command.reply('No');
    }
  }

  @Command('request', {
    description: 'Simple curl client with support for authentication for multiple services',
  })
  async request(command: CommandMessage) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const service = command.params[0].toLowerCase();
    const uri = command.params[1];

    if (service === 'launcher') {
      const token = await Auth.launcherAuth();
      const headers: any = {};
      headers['X-EpicGames-Lanuage'] = 'en';
      headers['Authorization'] = 'bearer ' + token;
      const res: any = await axios
        .get(`${Endpoints.LAUNCHER}${uri}`, { headers: headers, responseType: 'json' })
        .then((response) => {
          return response;
        })
        .catch((err) => {
          console.log(err);
        });

      command.reply('Response was ' + res.status);
      command.channel.send('```json\n' + beautify(res.data, null, 1, 150) + '```').catch(() => {
        command.reply('JSON Was to big for discord.');
      });
    } else if (service === 'fortnite') {
      const auth = new Auth.Auth();
      const token = await auth.login(false, '');
      const headers: any = {};
      headers['X-EpicGames-Lanuage'] = 'en';
      headers['Authorization'] = 'bearer ' + token;
      const res: any = await axios
        .get(`${Endpoints.PUBLIC_BASE_URL}${uri}`, { headers: headers, responseType: 'json' })
        .then((response: import('axios').AxiosResponse<any> | PromiseLike<import('axios').AxiosResponse<any>>) => {
          return response;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          console.log(error);
        });

      command.reply('Response was ' + res.status);
      command.channel.send('```json\n' + beautify(res.data, null, 1, 150) + '```').catch(() => {
        command.reply('JSON Was to big for discord.');
      });
    } else if (service === 'lightswitch') {
      const res = await axios.get(`${Endpoints.LIGHT_SWITCH}${uri}`);
      command.channel.send(`Response was ${res.status}`).catch((error) => {
        command.reply('There was an error....');
        console.log(error);
      });
      command.channel.send('```json\n' + beautify(res.data, null, 2, 100) + '```').catch((error) => {
        command.reply('Something went wrong...');
        console.log(error);
      });
    } else if (service === 'curl') {
      const headers: any = {};
      headers['User-Agent'] = `Pixel/1.0 (Platform=${os.platform().toUpperCase()}/${os.release()})`;
      const res = await axios.get(uri, { headers: headers });
      const parsedRes: string[] = new Array(beautify(res.data, null, 2, 100));
      //console.log(parsedRes);
      const channel: any = command.channel;
      const Pagination = new FieldsEmbed()
        // A must: an array to paginate, can be an array of any type
        .setArray(parsedRes)
        // Set users who can only interact with the instance, set as `[]` if everyone can interact.
        .setAuthorizedUsers([command.author.id])
        // A must: sets the channel where to send the embed
        .setChannel(channel)
        // Elements to show per page. Default: 10 elements per page
        .setElementsPerPage(5)
        // Have a page indicator (shown on message content)
        .setPageIndicator(false)
        .formatField('output', (i) => {
          for (let v = 0; i < 5; ++v) {
            i;
          }
        })
        .setDeleteOnTimeout(true);
      // Format based on the array, in this case we're formatting the page based on each object's `word` property
      Pagination.embed
        .setColor(0x00ffff)
        .setTitle(`CURL`)
        .setDescription(`Response was ${res.status}`)
        .setTimestamp()
        .setFooter('Pixel, a discord bot. made by QPixel');

      await Pagination.build();
    } else if (service === 'pixelapi') {
      const headers: any = {};
      headers['User-Agent'] = `Pixel/1.0 (Platform=${os.platform().toUpperCase()}/${os.release()})`;
      const res = await axios.get(`http://api.qpixel.me/api/${uri}`, { headers: headers });

      command.reply('Response was ' + res.status);
      command.channel.send('```json\n' + beautify(res.data, null, 1, 150) + '```').catch(() => {
        command.reply('JSON Was to big for discord.');
      });
    } else {
      command.reply('You did not specify what service.');
    }
  }
  @CommandNotFound({ prefix: prefix })
  notFoundA(command: CommandMessage) {
    command.reply('Command not found');
  }
}
