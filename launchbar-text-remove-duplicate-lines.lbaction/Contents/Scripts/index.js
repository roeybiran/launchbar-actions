"use strict";

const lb = require("launchbar-node");

const input = process.argv.splice(2);
const linesSeen = [];
input.forEach(textArg => {
  textArg.split("\n").forEach(line => {
    if (!linesSeen.includes(line)) {
      linesSeen.push(line);
    }
  });
});
const finalText = linesSeen.join("\n");

if (lb.options.commandKey) {
  console.log(finalText);
} else {
  lb.paste(finalText);
}
