"use strict";

const lb = require("launchbar-node");
const inputDialog = require("@roeybiran/ask-for-input");

(async () => {
  const inputText = process.argv.splice(2);
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

  const allLines = inputText.map(argument => {
    return argument.split("\n").map(line => {
      return `${startToken}${line}${endToken}`;
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
