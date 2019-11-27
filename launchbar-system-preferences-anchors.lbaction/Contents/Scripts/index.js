"use strict";

const lbcache = require("@roeybiran/launchbar-cache");
const { execFile } = require("@roeybiran/task");
const path = require("path");

(async () => {
  const script = path.join(__dirname, "getAnchors.scpt");

  let output;
  const cachedAnchors = lbcache.get("anchors", { ignoreMaxAge: true });

  if (!cachedAnchors) {
    const { stdout } = await execFile("/usr/bin/osascript", [script]);
    output = stdout.split("\n").map(pane => {
      const anchors = pane.split("\t");
      const paneName = anchors[0];
      const anchorName = anchors[1];
      const paneID = anchors[2];
      return {
        title: `${paneName} > ${anchorName}`,
        anchorName,
        paneID,
        icon: "com.apple.systempreferences",
        action: "openAnchor.sh"
      };
    });
    lbcache.set("anchors", output, { maxAge: 5000 });
  } else {
    output = cachedAnchors;
  }
  console.log(JSON.stringify(output));
})();
