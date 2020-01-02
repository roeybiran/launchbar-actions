"use strict";

const lb = require("launchbar-node");

const trimSpaces = text => {
  return text.replace(/^\s+|\s+$/g, "").replace(/\s{2,}/, " ");
};

lb.textAction(process.argv.splice(2), trimSpaces);
