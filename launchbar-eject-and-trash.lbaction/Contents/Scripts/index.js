"use strict";

const { execFile } = require("@roeybiran/task");
const plist = require("simple-plist");

(async () => {
  const lbOutput = [];
  const allImages = [];
  const { stdout } = await execFile("/usr/bin/hdiutil", ["info", "-plist"]);
  const hdiutil = plist.parse(stdout);
  const imagesArray = hdiutil.images;
  imagesArray.forEach(imageDict => {
    const systemEntitiesArray = imageDict["system-entities"];
    const lastEntity = systemEntitiesArray[systemEntitiesArray.length - 1];
    if (lastEntity["mount-point"]) {
      const image = {
        volumePath: lastEntity["mount-point"],
        imagePath: imageDict["image-path"]
      };
      allImages.push(image);
      lbOutput.push({
        title: image.volumePath,
        subtitle: image.imagePath,
        images: [image],
        icon: imageDict["icon-path"],
        action: "ejectAndTrash.sh"
      });
    }
  });
  if (allImages.length === 0) {
    return console.log(
      JSON.stringify([
        {
          title: "No disk images",
          icon: "font-awesome:warning"
        }
      ])
    );
  }
  lbOutput.push({
    title: "Eject & Trash All",
    subtitle: allImages
      .map(x => {
        return x.imagePath;
      })
      .join(),
    images: allImages,
    action: "ejectAndTrash.sh"
  });
  return console.log(JSON.stringify(lbOutput, null, " "));
})();
