"use strict";

const lb = require("launchbar-node");

(async () => {
  lb.hide();
  const chosenEmoji = process.argv[2];
  await lb.setClipboardString(chosenEmoji);
  lb.paste(chosenEmoji);
})();
