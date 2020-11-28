import Listener from "../structures/Listener";

export default class ReadyListener extends Listener {
  constructor () {
    super("ready", {
      emitter: "client",
      event: "ready"
    });
  }
  exec() {
    
    this.client.logger.info("z");
  } 
}