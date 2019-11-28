"use strict";

const tildify = require("tildify");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), tildify);
