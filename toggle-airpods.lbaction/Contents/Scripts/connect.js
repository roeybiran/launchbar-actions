"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

module.exports = async airpodsAddress => {
  try {
    lb.hide();
    const { stdout } = await execFile("/usr/local/bin/blueutil", [
      "--is-connected",
      airpodsAddress
    ]);
    let arg;
    const status = stdout;
    if (status === "0") {
      arg = "--connect";
    } else if (status === "1") {
      arg = "--disconnect";
    }
    execFile("/usr/local/bin/blueutil", [arg, airpodsAddress]);
  } catch (error) {
    const msg =
      error.code === "ENOENT" ? "This action requires blueutil" : error;
    console.log(msg);
  }
};