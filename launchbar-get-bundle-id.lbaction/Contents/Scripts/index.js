"use strict";

const lb = require("launchbar-node");
const getBundleId = require("@roeybiran/get-bundle-id");
const lbcache = require("@roeybiran/launchbar-cache");

(async () => {
  try {
    const input = process.argv.splice(2);
    let output = [];

    for (const app of input) {
      let id;
      const cachedBundleId = lbcache.get(app, { ignoreMaxAge: true });
      if (cachedBundleId) {
        id = cachedBundleId;
      } else {
        id = await getBundleId.async(app);
        if (!id) {
          id = `Failed to obtain bundle ID for "${app}"`;
        } else {
          lbcache.set(app, id, { maxAge: 5000 });
        }
      }
      output.push(id);
    }

    output = output.join("\n");
    await lb.setClipboardString(output);
    if (lb.env.commandKey) {
      return console.log(output);
    }
    return lb.paste(output);
  } catch (error) {
    return console.log(error);
  }
})();
