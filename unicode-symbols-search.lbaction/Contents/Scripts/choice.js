"use strict";

const lb = require("launchbar-node");

(async () => {
  const symbol = process.argv[2];
  await lb.setClipboardString(symbol);
  await lb.paste(symbol);
})();
