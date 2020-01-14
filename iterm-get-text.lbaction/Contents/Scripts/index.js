"use strict";

const cp = require("child_process");

const script = `
tell application "iTerm"
	tell window 1
		tell tab 1
			tell session 1
				return its text
			end tell
		end tell
	end tell
end tell
`;

const lines = [];

cp.execFileSync("/usr/bin/osascript", ["-e", script], { encoding: "utf-8" })
  .split("\n")
  .filter(x => {
    return !/^\s+$/.test(x);
  })
  .forEach(x => {
    if (!lines.includes(x)) {
      lines.push(x);
    }
  });

console.log(
  JSON.stringify(
    lines.reverse().map(x => {
      return { title: x };
    })
  )
);
