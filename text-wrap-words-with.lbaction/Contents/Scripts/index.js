"use strict";

const lb = require("launchbar-node");
const inputDialog = require("@roeybiran/ask-for-input");

(async () => {
  const textInput = process.argv.splice(2);
  const asymmetricTokens = [
    ["[", "]"],
    ["(", ")"],
    ["<", ">"],
    ["{", "}"]
  ];

  const token = await inputDialog({
    text: "Choose wrapping token:",
    withApp: "LaunchBar"
  });
  if (!token) process.exit();
  let startToken = token;
  let endToken = token;

  for (let index = 0; index < asymmetricTokens.length; index += 1) {
    const asymmetricToken = asymmetricTokens[index];
    if (token === asymmetricToken[0]) {
      [startToken, endToken] = asymmetricToken;
    }
  }

  const matchAttempt = token.match(/^<(.+)>$/);
  if (matchAttempt) {
    startToken = `<${matchAttempt[1]}>`;
    endToken = `</${matchAttempt[1]}>`;
  }

  const allLines = textInput.map(argument => {
    return argument.split("\n").map(line => {
      return line
        .split(/(\w+)/)
        .map(wordParameter => {
          let word = wordParameter;
          if (/\w/.test(word)) {
            word = `${startToken}${word}${endToken}`;
          }
          return word;
        })
        .join("");
    });
  });

  if (lb.env.commandKey) {
    console.log(
      JSON.stringify(
        allLines[0].map(x => {
          return { title: x };
        })
      )
    );
  } else {
    lb.hide();
    lb.paste(allLines[0].join("\n"));
  }
})();
