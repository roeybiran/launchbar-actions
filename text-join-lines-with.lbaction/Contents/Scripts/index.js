"use strict";

const inputDialog = require("@roeybiran/ask-for-input");

(async () => {
  const lines = process.argv.splice(2);
  let joiner = await inputDialog({
    text: "Choose text joiner:",
    withApp: "LaunchBar"
  });

  if (!joiner) {
    process.exit();
  } else if (joiner === "\\n") {
    joiner = "\n";
  } else if (joiner === "\\t") {
    joiner = "\t";
  }

  const allLines = [];
  lines.forEach(line => {
    line.split("\n").forEach(lineFragment => {
      allLines.push(lineFragment);
    });
  });

  return console.log(allLines.join(joiner));
})();
