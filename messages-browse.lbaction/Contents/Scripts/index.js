"use strict";

const cp = require("child_process");
const path = require("path");

const sqlOutput = cp.execFileSync(
  "/usr/bin/sqlite3",
  [
    path.join(process.env.HOME, "/Library/Messages/chat.db"),
    "SELECT ROWID, text, date, destination_caller_id FROM message ORDER BY date DESC"
  ],
  { encoding: "utf-8" }
);

const msgs = sqlOutput
  .split(/^\d+\|/gm)
  .filter(x => {
    return x !== "";
  })
  .map(x => {
    const [title, subtitle] = x.split("|");
    return {
      title,
      subtitle
    };
  });

console.log(JSON.stringify(msgs));
