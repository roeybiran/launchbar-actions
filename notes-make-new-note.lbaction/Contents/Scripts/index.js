#!/usr/bin/env node

const path = require("path");
const cp = require("child_process");
const lb = require("launchbar-node");

let input = process.argv[2];

if (!lb.env.isLiveFeedbackEnabled) {
  cp.execFileSync(path.join(__dirname, "choice.sh"), [input]);
  process.exit();
}

input = process.argv[2].split("|");
let noteBody;
let noteTitle;
let displayTitle;
let displayBody;
if (input.length < 2) {
  noteTitle = "Untitled Note";
  [noteBody] = input;
  displayTitle = `Title: ${noteTitle}`;
  displayBody = `Body: ${noteBody}`;
} else {
  [noteTitle, noteBody] = input;
  displayTitle = `Title: ${noteTitle}`;
  displayBody = `Body: ${noteBody}`;
}

console.log(
  JSON.stringify([
    {
      title: displayTitle,
      subtitle: displayBody,
      noteTitle,
      noteBody,
      action: "choice.sh",
      actionRunInBackground: true,
      actionReturnsItems: false,
      icon: "com.apple.Notes"
    }
  ])
);
