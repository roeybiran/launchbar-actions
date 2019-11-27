"use strict";

const cache = require("@roeybiran/launchbar-cache");
const relativeDate = require("tiny-relative-date");
const lb = require("launchbar-node");
const path = require("path");

const shallowGlob = require("@roeybiran/shallow-glob");
const { execFile } = require("@roeybiran/task");

const sortByDateDescending = (a, b) => {
  if (a.date < b.date) {
    return 1;
  }
  if (a.date > b.date) {
    return -1;
  }
  return 0;
};

(async () => {
  try {
    const DOWNLOADS_DIR = path.join(process.env.HOME, "/Downloads");

    // just open the downloads folder
    if (lb.env.commandKey) {
      lb.hide();
      await execFile("/usr/bin/open", [DOWNLOADS_DIR]);
      process.exit();
    }

    const now = new Date();
    const promises = [];
    const fileNames = [];
    const output = [];

    const paths = await shallowGlob(DOWNLOADS_DIR);

    // TODO: MODULIZE
    if (paths.length === 0) {
      console.log(
        JSON.stringify([
          {
            title: "No Downloaded Items",
            url: "x-launchbar:hide",
            icon: "font-awesome:warning"
          }
        ])
      );
      process.exit();
    }

    paths.forEach(aPath => {
      let date =
        cache.get(aPath, { ignoreMaxAge: true }) ||
        execFile("/usr/bin/mdls", ["-name", "kMDItemDateAdded", "-raw", aPath])
          .then(result => {
            date = result.stdout.replace(/\+\d+$/, "UTC");
            cache.set(aPath, date, { maxAge: 5000 });
            return date;
          })
          .catch(err => err);
      promises.push(date);
      fileNames.push(aPath);
    });

    let results;

    try {
      results = await Promise.all(promises);
    } catch (error) {
      return console.log(error);
    }

    for (let index = 0; index < fileNames.length; index += 1) {
      output.push({
        path: fileNames[index],
        date: results[index],
        subtitle: `Downloaded ${relativeDate(results[index], now)}`
      });
    }

    output.sort(sortByDateDescending);

    if (lb.env.shiftKey) {
      lb.hide();
      await execFile("/usr/bin/open", [output[0].path]);
      process.exit();
    }
    return console.log(JSON.stringify(output, null, " "));
  } catch (error) {
    return console.log(error);
  }
})();
