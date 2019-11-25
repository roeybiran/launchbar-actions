"use strict";

const juration = require("juration");

const input = process.argv[2];
let item;

(async () => {
  try {
    if (!input) {
      item = {
        title: "Toggling Amphetamine Indefinitely",
        icon: "com.if.Amphetamine",
        action: "choice.sh"
      };
    } else {
      const secs = juration.parse(input);
      const timeString = juration.stringify(secs, { format: "long", units: 1 });
      const timeArg = timeString.split(" ");
      const duration = timeArg[0];
      let interval = timeArg[1];
      // make sure interval is always a plural
      if (!interval.endsWith("s")) {
        interval += "s";
      }
      item = {
        title: `Enabling Amphetamine for ${timeString}`,
        icon: "com.if.Amphetamine",
        action: "choice.sh",
        duration,
        interval
      };
    }
    return console.log(JSON.stringify([item]));
  } catch (error) {
    return console.log(error);
  }
})();
