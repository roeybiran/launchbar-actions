"use strict";

const lb = require("launchbar-node");

const output = process.argv.splice(2).map(str => {
  return str.replace(/^\s*$\n/gm, "");
});

lb.paste(output.join("\n"));
