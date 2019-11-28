"use strict";

const paramCase = require("param-case");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), paramCase);
