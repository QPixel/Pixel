import type { Snowflake } from "discord.js";
import { Collection, SnowflakeUtil } from "discord.js";
import type { ISongs as ISongManager, ISong } from "structures/commoninterfaces";

export default class SongManager extends Collection<Snowflake, ISong> implements ISongManager {
  public constructor(data?: ReadonlyArray<readonly [Snowflake, ISong]> | null) {
    super(data);
  }
  public addSong(song: ISong): this {
    return this.set(SnowflakeUtil.generate(), song);
  }

  public deleteFirst(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.delete(this.firstKey()!);
  }
  public clear(): this {
    this.forEach((v: ISong, k: Snowflake) => {
      this.delete(k);
    });
    return this;
  }
}
