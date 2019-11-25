"use strict";

const chooseFolder = require("@roeybiran/choose-folder");
const path = require("path");
const { execFile } = require("@roeybiran/task");
const lb = require("launchbar-node");

(async () => {
  lb.hide();
  const input = JSON.parse(process.argv[2]);
  const { archivePath } = input;
  const { filesToUnzip } = input;
  const { internalPath } = input;

  let unzipDestination = path.join(process.env.HOME, "Desktop");
  if (lb.env.shiftKey) {
    unzipDestination = await chooseFolder({
      prompt: "Choose Destination",
      multiSelectionsAllowed: false
    });
  }

  await execFile("/usr/bin/unzip", [
    "-B",
    archivePath,
    filesToUnzip,
    "-d",
    unzipDestination
  ]);
  await execFile("/usr/bin/open", [
    "-R",
    path.join(unzipDestination, internalPath)
  ]);
})();
