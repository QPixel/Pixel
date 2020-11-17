import { Listener as AkairoListener, ListenerOptions } from "discord-akairo";
import type Client from "../client";

export default class Listener extends AkairoListener {
  client: Client;
  constructor (id: string, options: ListenerOptions) {
    super(id, options);
  }
}