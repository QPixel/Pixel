import { Auth } from '../lib/auth';
import { prefix } from '../util/env';
import { Command, Discord, CommandMessage } from '@typeit/discord';

@Discord({ prefix: prefix })
export class CommandGetHotFix {
  @Command('fixAuth', {
    description: 'Fixes the auth by exchange code',
  })
  async fixAuth(command: CommandMessage) {
    const auth = new Auth();
    const exchangeCode = command.params[0];
    await auth.login(true, exchangeCode);
  }
}
