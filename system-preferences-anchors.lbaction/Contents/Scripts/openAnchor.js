"use strict";

const path = require("path")
const { execFile } = require("@roeybiran/task");
const lb = require("launchbar-node");

(async () => {
  const args = JSON.parse(process.argv[2]);
  const { anchorName } = args;
  const { paneID } = args;
  const script = path.join(__dirname, "openAnchor.scpt");
  execFile("/usr/bin/osascript", [script, anchorName, paneID]);
  lb.hide();
})();
