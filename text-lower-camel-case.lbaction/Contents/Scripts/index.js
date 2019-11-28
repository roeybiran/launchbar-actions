"use strict";

const camelCase = require("camel-case");
const lb = require("launchbar-node");

(async () => {
  lb.textAction(process.argv.splice(2), camelCase);
})();
