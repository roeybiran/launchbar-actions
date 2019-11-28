"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

(async () => {
  try {
    lb.hide();
    const npmPackage = JSON.parse(process.argv[2]);
    const url = lb.env.shiftKey ? npmPackage.npmUrl : npmPackage.url;
    await execFile("/usr/bin/open", [url]);
  } catch (error) {
    console.log(error);
  }
})();
