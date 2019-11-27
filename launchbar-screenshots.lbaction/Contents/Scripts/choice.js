"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

(async () => {
  try {
    await lb.hide();
    const inputObject = JSON.parse(process.argv[2]);

    let inputObjectArguments;
    if (lb.env.shiftKey) {
      inputObjectArguments = inputObject.modifiers.shift;
    } else if (lb.env.alternateKey) {
      inputObjectArguments = inputObject.modifiers.alt;
    } else if (lb.env.controlKey) {
      inputObjectArguments = inputObject.modifiers.control;
    } else if (lb.env.commandKey) {
      inputObjectArguments = inputObject.modifiers.command;
    } else {
      inputObjectArguments = inputObject.modifiers.default;
    }

    let timeout;
    if (inputObject.sleep) {
      timeout = inputObject.sleep * 1000;
    } else {
      timeout = 0;
      // if capture mode is full screen, introduce a small delay
      // to make sure launchbar itself doesnt make it into the screesnhot
      switch (inputObjectArguments.args[0]) {
        case "-Sc":
        case "-S":
        case "-SP":
          await execFile("/bin/sleep", ["0.5"]);
          break;
        default:
          break;
      }
    }

    setTimeout(async () => {
      if (inputObjectArguments.screenCaptureUI) {
        setTimeout(() => {
          execFile("/usr/bin/osascript", [
            "-e",
            `tell application "System Events" to tell application process "screencaptureui" to tell window 1 to click checkbox "${inputObjectArguments.screenCaptureUI}"`
          ]);
        }, 500);
      }

      await execFile("/usr/sbin/screencapture", inputObjectArguments.args);

      if (inputObjectArguments.screenCaptureUI) {
        setTimeout(() => {
          execFile("/usr/bin/osascript", [
            "-e",
            'tell application "System Events" to click button 1 of window 1 of application process "Screen Shot"'
          ]);
        }, 500);
      }
    }, timeout);
  } catch (error) {
    console.log(error);
  }
})();
