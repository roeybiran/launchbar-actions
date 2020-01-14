"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

const address = process.argv[2];

(async () => {
  try {
    lb.hide();
    const { stdout } = await execFile("/usr/local/bin/blueutil", [
      "--is-connected",
      address
    ]);
    let arg;
    if (stdout === "0") {
      arg = "--connect";
    } else if (stdout === "1") {
      arg = "--disconnect";
    }
    execFile("/usr/local/bin/blueutil", [arg, address]);
  } catch (error) {
    const msg =
      error.code === "ENOENT" ? "This action requires blueutil" : error;
    console.log(msg);
  }
})();
