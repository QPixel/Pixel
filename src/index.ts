import { getHotFixHash } from './GetHotFix';
import { Auth } from './lib/auth';
import { DiscordBot } from './DiscordBot';
const hotfixpath = `${__dirname}/../`;
const cache: any = {
  currentGameHash: undefined,
  currentEngineHash: undefined,
};
class Start {
  public static _auth: Auth;
  public static accessToken: Promise<string>;
  static async init() {
    this._auth = new Auth();
    DiscordBot.start().then(async () => {
      this.accessToken = await this._auth.login(false, '');
    });
    this.setupCache();
  }
  static async setupCache() {
    cache.currentGameHash = await getHotFixHash(await this.accessToken, 'defaultgame.ini');
    cache.currentEngineHash = await getHotFixHash(await this.accessToken, 'defaultengine.ini');
  }
  /*
  async getHotfix(compare: boolean, auth: string) {
    if (compare == true) {
      const oldDefaultEngine = fs.readFileSync(`${hotfixpath}/DefaultEngine.ini`);
      const oldDefaultGame = fs.readFileSync(`${hotfixpath}/DefaultGame.ini`);
      const defaultGameHash = await getHotFixHash(auth, 'defaultgame.ini');
      const defaultEngineHash = await getHotFixHash;
    }
    const defaultEngineFilename = await hotFixParser(auth, 'defaultgame.ini');
  }*/
}
Start.init();
