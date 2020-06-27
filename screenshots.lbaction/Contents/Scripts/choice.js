"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");
const path = require("path");
const fs = require("fs");

(async () => {
  try {
    await lb.hide();

    const inputObject = JSON.parse(process.argv[2]);

    if (inputObject.delayValue) {
      await execFile("/bin/sleep", [inputObject.delayValue]);
    } else if (/-Sc|-S|-SP/.test(inputObject.args[0])) {
      // if capture mode is full screen, introduce a small delay to make sure launchbar itself doesnt make it into the screesnhot
      await execFile("/bin/sleep", ["1"]);
    }

    if (inputObject.screenCaptureUI) {
      setTimeout(() => {
        execFile("/usr/bin/osascript", [
          "-e",
          `tell application "System Events" to tell application process "screencaptureui" to tell window 1 to click checkbox "${inputObject.screenCaptureUI}"`
        ]);
      }, 500);
    }

    await execFile("/usr/sbin/screencapture", inputObject.args);

    if (inputObject.screenCaptureUI) {
      setTimeout(() => {
        execFile("/usr/bin/osascript", [
          "-e",
          'tell application "System Events" to click button 1 of window 1 of application process "Screen Shot"'
        ]);
      }, 500);
    }

    if (inputObject.imgur) {
      const tempFile = inputObject.args[1];
      await execFile(
        path.join(
          process.env.HOME,
          "Library/Application Support/LaunchBar/Actions/shared/upload-to-imgur/main.sh"
        ),
        [tempFile]
      );
      fs.unlinkSync(tempFile);
    }
  } catch (error) {
    console.log(error);
  }
})();
