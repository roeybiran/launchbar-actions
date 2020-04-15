"use strict";

const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), text => {
  return text.replace(/“|”/g, '"').replace(/‘|’/g, "'");
});
