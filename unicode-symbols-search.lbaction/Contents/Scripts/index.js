"use strict";

// https://github.com/bevesce/unicode-symbols-search

const path = require("path");
const util = require("util");
const fs = require("fs");
const fuzz = require("fuzzball");

const readFile = util.promisify(fs.readFile);

(async () => {
  const fuzzballOptions = {
    processor: choice => choice.subtitle,
    scorer: fuzz.partial_ratio,
    limit: 32,
    cutoff: 50,
    unsorted: false
  };
  const input = process.argv[2] || process.exit();
  const symbolsFile = path.join(__dirname, "symbols.json");
  const fileData = await readFile(symbolsFile, {
    encoding: "utf-8"
  });
  const launchbarOutput = JSON.parse(fileData).map(symbolObject => {
    const { symbol } = symbolObject;
    const { description } = symbolObject;
    return {
      title: symbol,
      subtitle: description,
      action: "choice.sh",
      actionArgument: symbol,
      icon: "Text.icns"
    };
  });
  // TODO: modulize fuzzy-search in launchbar-node
  const launchbarOutputSorted = fuzz
    .extract(input, launchbarOutput, fuzzballOptions)
    .map(x => {
      return x[0];
    });
  return console.log(JSON.stringify(launchbarOutputSorted, null, " "));
})();
