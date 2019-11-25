"use strict";

const headerCase = require("header-case");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), headerCase);
