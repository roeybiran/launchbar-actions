"use strict";

const { execFile } = require("@roeybiran/task");
const path = require("path");

(async () => {
  const input = JSON.parse(process.argv[2]);
  const script = path.join(__dirname, "ejectAndTrash.scpt");
  const { images } = input;
  images.forEach(async diskImage => {
    const { imagePath } = diskImage;
    const { volumePath } = diskImage;
    await execFile("/usr/bin/osascript", [script, volumePath, imagePath]);
  });
})();
