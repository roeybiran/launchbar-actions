"use strict";

const cp = require("child_process");
const lb = require("launchbar-node");

let args;

try {
  args = JSON.parse(process.argv[2]);
} catch (error) {
  lb.displayNotification({
    text: error
  });
}

const script = `
on run argv
	set theYear to item 1 of argv
	set theMonth to item 2 of argv
	set theDay to item 3 of argv
	set theTime to item 4 of argv
	set theName to item 5 of argv
	set theDate to current date
	tell theDate
		set its year to theYear
		set its month to theMonth
		set its day to theDay
		set its time to theTime
	end tell
  tell application "Reminders"
    return id of (make new reminder with properties {name:theName, due date:theDate})
  end tell
end run
`;

try {
  lb.hide();
  const reminderID = cp.execFileSync(
    "/usr/bin/osascript",
    [
      "-e",
      script,
      args.year,
      args.month,
      args.day,
      args.secondsSinceMidnight,
      args.name
    ],
    { encoding: "utf8" }
  );
  lb.displayNotification({
    text: `Successfully created reminder "${args.name}" with ID "${reminderID}"`
  });
} catch (error) {
  lb.displayNotification({ text: error });
}
