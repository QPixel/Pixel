import SongManager from "../util/SongManager";
import type { IServerQueue } from "./commoninterfaces";

export default class ServerQueue implements IServerQueue {
  public connection: IServerQueue["connection"] = null;
  public readonly songs: IServerQueue["songs"] = new SongManager();
  public volume: IServerQueue["volume"] = 0;
  public playing: IServerQueue["playing"] = false;
  public loopMode: IServerQueue["loopMode"] = 0;
  public readonly timeout: NodeJS.Timeout | null = null;
  public constructor(public textChannel: IServerQueue["textChannel"] = null, public voiceChannel: IServerQueue["voiceChannel"] = null) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.volume = textChannel!.client.config.defaultVolume;
  }
}