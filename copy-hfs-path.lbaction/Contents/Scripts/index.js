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
    const joinedPaths = hfsPaths.join(delimiter);
    lb.hide();
    lb.setClipboardString(joinedPaths);
    lb.paste(joinedPaths);
  } catch (error) {
    console.log(error);
  }
})();
