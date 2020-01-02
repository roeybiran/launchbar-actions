"use strict";

const path = require("path");
const lb = require("launchbar-node");
const { parse } = require("simple-plist");
const { execFile } = require("@roeybiran/task");
// TODO: MODULIZE
/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string=} options.subtitle
 */
const errorMessage = options => {
  // https://www.obdev.at/resources/launchbar/help/
  return {
    title: options.title,
    subtitle: options.subtitle || undefined,
    icon: "font-awesome:warning"
  };
};

(async () => {
  try {
    const { stdout } = await execFile("/usr/sbin/diskutil", [
      "list",
      "-plist",
      "external"
    ]);
    const { VolumesFromDisks } = parse(stdout);
    if (VolumesFromDisks.length === 0) {
      console.log(
        JSON.stringify([errorMessage({ title: "No mounted volumes" })])
      );
      process.exit();
    }

    const volumePaths = VolumesFromDisks.map(x => {
      return { path: path.join("/Volumes", x) };
    });

    if (lb.env.spaceKey) {
      console.log(JSON.stringify(volumePaths));
      process.exit();
    }
    await execFile("/usr/bin/open", [volumePaths[0].path]);
    await lb.hide();
  } catch (error) {
    console.log(error);
  }
})();
