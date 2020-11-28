import Listener from "../structures/Listener";

export default class TagListener extends Listener {
  constructor () {
    super("test", {
      emitter: "client",
      event: ""
    });
  }
}