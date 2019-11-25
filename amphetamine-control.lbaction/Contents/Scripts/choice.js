"use strict";

const runApplescript = require("run-applescript");
const lb = require("launchbar-node");

(async () => {
  try {
    const input = JSON.parse(process.argv[2]);
    const { duration } = input;
    const { interval } = input;
    let scpt;
    // scheduled session
    if (duration) {
      scpt = `tell application "Amphetamine" to start new session with options {duration:${duration}, interval:${interval}, displaySleepAllowed:false}`;
      // indefinite session = toggle
    } else {
      scpt = `
            if application "Amphetamine" is running then
                tell application "Amphetamine"
                    if (session is active) = true then
                        end session
                        do shell script "killall Amphetamine"
                    else
                        start new session
                    end if
                end tell
            else
                tell application "Amphetamine"
                    activate
                    delay 0.2
                    start new session
                end tell
            end if`;
    }
    await lb.hide();
    await runApplescript(scpt);
  } catch (error) {
    console.log(error);
  }
})();
