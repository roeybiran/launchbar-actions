"use strict";

const pascalCase = require("pascal-case");
const lb = require("launchbar-node");

const input = process.argv.splice(2) || process.exit();
lb.textAction(input, pascalCase, "\n");
