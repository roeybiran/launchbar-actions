#!/usr/bin/env node

const cp = require("child_process");
const lb = require("launchbar-node");

const applescript = args => {
  return cp
    .execFileSync("/usr/bin/osascript", ["-e", ...args], {
      encoding: "utf-8"
    })
    .trim();
};

lb.hide();
const input = JSON.parse(process.argv[2]);
const title = input.noteTitle;
const body = input.noteBody;

try {
  let script = `on run argv
    set noteTitle to item 1 of argv
    set noteBody to item 2 of argv
    tell application "Notes" to set theNote to make new note with properties {name:noteTitle, body:noteBody}
    set _msg to (noteTitle as text) & " — " & (noteBody as text)
    tell application "LaunchBar" to display in notification center _msg with title "Created New Note"
    return theNote
  end run`;
  // weird behavior since mojave, returns note url with a "show id ..." command prefixed
  const noteID = applescript([script, title, body]).replace("show id ", "");
  script = `on run argv
    tell application "Notes" to show note id (item 1 of argv)
  end run`;
  if (!lb.env.shiftKey) {
    applescript([script, noteID]);
  }
} catch (error) {
  console.log(error);
}
