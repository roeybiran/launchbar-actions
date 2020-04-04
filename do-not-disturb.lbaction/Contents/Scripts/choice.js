"use strict";

const path = require("path");
const { execFile } = require("@roeybiran/task");
const { promisify } = require("util");
const dnd = require("@sindresorhus/do-not-disturb");
const plist = require("simple-plist");
const lb = require("launchbar-node");

const writePlist = promisify(plist.writeFile);

const label = "com.roeybiran.LaunchBar.DoNotDisturb";
const launchdDir = `${process.env.HOME}/Library/LaunchAgents`;
const PLIST_FILE = path.join(launchdDir, `${label}.plist`);

const launchd = async mode => {
  await execFile("/bin/launchctl", [mode, PLIST_FILE]);
};

(async () => {
  try {
    lb.hide();

    let input;
    try {
      input = JSON.parse(process.argv[2]);
    } catch (_) {
      input = process.argv[2];
    }

    if (input.title === "Toggle") {
      dnd.toggle();
    } else if (input === "stop") {
      await dnd.disable();
      await lb.displayNotification({
        text: 'Exiting "Do Not Disturb"'
      });
      const plistObj = { Label: label };
      await writePlist(PLIST_FILE, plistObj);
      await launchd("unload");
    } else {
      dnd.enable();
      const plistObj = {
        Label: label,
        ProgramArguments: ["/usr/local/bin/node", __filename, "stop"],
        StartCalendarInterval: {
          Hour: Number(input.hours),
          Minute: Number(input.minutes)
        }
      };
      await launchd("unload");
      await writePlist(PLIST_FILE, plistObj);
      await launchd("load");
    }
  } catch (error) {
    console.log(error);
  }
})();
