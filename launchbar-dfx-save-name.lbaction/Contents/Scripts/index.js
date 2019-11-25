"use strict";

const dfx = require("default-folder-x-node");

(async () => {
  const chosenName = process.argv[2] || process.exit();
  await dfx.setSaveName(chosenName);
})();
