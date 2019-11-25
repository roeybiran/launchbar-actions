"use strict";

const constantCase = require("constant-case");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), constantCase);
