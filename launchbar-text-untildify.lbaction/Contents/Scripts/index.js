"use strict";

const untildify = require("untildify");
const lb = require("launchbar-node");

lb.textAction(process.argv.splice(2), untildify);
