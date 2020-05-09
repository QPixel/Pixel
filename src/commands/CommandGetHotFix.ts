import { Auth } from '../lib/auth';
import { prefix } from '../util/env';
import { Command, Discord, CommandMessage, Client } from '@typeit/discord';
import { hotFixParser, hotFixClient } from '../GetHotFix';

@Discord({ prefix: prefix })
export class CommandGetHotFix {
  @Command('gethotfix', { description: 'Pull any hotfix file' })
  async getHotFix(command: CommandMessage) {
    const auth = new Auth();
    const authlogin = await auth.login(false, '');
    const hotfixfilename = command.params[0];
    const otherParams = command.params[1];
    if (hotfixfilename === undefined) {
      command.reply('No parameters sent');
    } else if (otherParams === 'true') {
      console.log('This works');
    } else {
      const uniqueFilename = await hotFixParser(authlogin, hotfixfilename);
      const hotfixres = await hotFixClient(uniqueFilename, authlogin);
      command.channel.send(hotfixres);
    }
  }
}
