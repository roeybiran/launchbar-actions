#!/usr/bin/env node

const path = require("path");
const cp = require("child_process");
const lb = require("launchbar-node");

// if (!process.argv[2]) {
// }

let input = process.argv[2];

if (!lb.env.isLiveFeedbackEnabled) {
  cp.execFileSync(path.join(__dirname, "choice.sh"), [input]);
  process.exit();
}

input = process.argv[2].split("  ");
let body;
let title;
if (input.length < 2) {
  title = "Untitled Note";
  [body] = input;
} else {
  [title, body] = input;
}

console.log(
  JSON.stringify([
    {
      title,
      subtitle: body,
      action: "choice.sh",
      actionRunInBackground: true,
      actionReturnsItems: false
    }
  ])
);
