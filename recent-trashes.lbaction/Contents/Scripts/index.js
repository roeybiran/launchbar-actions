"use strict";

const relativeDate = require("tiny-relative-date");
const lb = require("launchbar-node");
const path = require("path");
const fs = require("fs");
const util = require("util");
const cache = require("@roeybiran/launchbar-cache");

const shallowGlob = require("@roeybiran/shallow-glob");
const { execFile } = require("@roeybiran/task");

const statPromisified = util.promisify(fs.lstat);

// TODO:
// make caching based on inodes

const sortByDateDescending = (a, b) => {
  if (a.date > b.date) {
    return -1;
  }
  if (a.date < b.date) {
    return 1;
  }
  return 0;
};

(async () => {
  try {
    const TRASH_DIR = path.join(process.env.HOME, "/.Trash");
    if (lb.env.shiftKey) {
      lb.hide();
      await execFile("/usr/bin/open", [TRASH_DIR]);
      process.exit();
    }

    const now = new Date();
    const promises = [];
    const fileNames = [];
    const output = [];
    const paths = await shallowGlob(TRASH_DIR);

    if (paths.length === 0) {
      lb.output([
        {
          title: "Trash is empty",
          icon: "font-awesome:fa-info-circle"
        }
      ]);
      process.exit();
    }

    let date;

    paths.forEach(aPath => {
      const cachedDate = cache.get(aPath, { ignoreMaxAge: true });
      if (cachedDate) {
        // console.log("Pulling from cache");
        date = cachedDate;
      } else {
        // console.log("Fetching date using stat");
        date = statPromisified(aPath)
          .then(result => {
            const fetchedDate = result.ctime.toISOString();
            cache.set(aPath, fetchedDate, { maxAge: 5000 });
            return fetchedDate;
          })
          .catch(err => err);
      }
      promises.push(date);
      fileNames.push(aPath);
    });

    const results = await Promise.all(promises);
    for (let index = 0; index < results.length; index += 1) {
      date = results[index];
      output.push({
        path: fileNames[index],
        date,
        subtitle: `Trashed ${relativeDate(date, now)}`
      });
    }
    return console.log(
      JSON.stringify(output.sort(sortByDateDescending), null, " ")
    );
  } catch (error) {
    return console.log(error);
  }
})();
