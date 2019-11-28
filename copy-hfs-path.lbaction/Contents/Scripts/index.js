"use strict";

const lb = require("launchbar-node");
const toHfs = require("@roeybiran/posix-to-hfs");

(async () => {
  const paths = process.argv.slice(2);
  try {
    const delimiter = "\n";
    const hfsPaths = await toHfs(paths);
    if (lb.env.commandKey) {
      console.log(
        JSON.stringify(
          hfsPaths.map(x => {
            return {
              title: x
            };
          })
        )
      );
      process.exit();
    }
    lb.hide();
    lb.paste(hfsPaths.join(delimiter));
  } catch (error) {
    console.log(error);
  }
})();
