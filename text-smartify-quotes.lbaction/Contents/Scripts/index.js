"use strict";

const lb = require("launchbar-node");

const inputText = process.argv[2];

lb.textAction([inputText], x => {
  return x.replace(/"/g, "”");
});

// const openingSmartQuote = "“";
// const closingSmartQuote = "”";

// let dumbQuoteCounter = 0;
// for (let index = 0; index < inputText.length; index += 1) {
//   if (inputText.charAt(index) === '"') {
//     dumbQuoteCounter += 1;
//     if (dumbQuoteCounter % 2 === 0) {
//       console.log(closingSmartQuote);
//     } else {
//       console.log(openingSmartQuote);
//     }
//   }
// }
