"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

(async () => {
  lb.hide();
  const input = JSON.parse(process.argv[2]);
  let signal = "SIGTERM";
  if (lb.env.alternateKey) {
    signal = "SIGKILL";
  }
  await execFile("/bin/kill", ["-s", signal, input.pid]);
  if (lb.env.shiftKey) {
    setTimeout(() => {
      execFile("/usr/bin/open", ["-a", input.path]);
    }, 2000);
  }
})();
