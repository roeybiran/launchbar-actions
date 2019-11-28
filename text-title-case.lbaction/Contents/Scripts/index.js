"use strict";

const titleCase = require("title-case");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), titleCase);
