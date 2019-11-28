"use strict";

const path = require("path");
const { execFile } = require("@roeybiran/task");

(async () => {
  const archives = process.argv.splice(2);
  const paths = [];
  const promises = archives.map(archive => {
    paths.push(archive);
    return execFile("/usr/bin/unzip", ["-l", archive]);
  });

  let resolvedPromises;
  try {
    resolvedPromises = await Promise.all(promises);
  } catch (error) {
    return console.log(error);
  }

  const archiveContents = [];
  for (let index = 0; index < paths.length; index += 1) {
    const archivePath = paths[index];
    const resolvedPromise = resolvedPromises[index];
    const { stdout } = resolvedPromise;
    // split `unzip`'s output to lines
    // remove headers and footers
    // remove the leading chars which are data
    // each line is a an internal path
    const fileList = stdout.split("\n");
    archiveContents.push(
      fileList
        .slice(3, fileList.length - 2)
        .filter(line => {
          return !/\.DS_Store|__MACOSX/.test(line);
        })
        .forEach(lineParam => {
          const line = lineParam.slice(30);
          const title = path.basename(line);
          const subtitle = path.join(path.basename(archivePath), line);
          let filesToUnzip = line;
          let icon = "font-awesome:fa-file";
          if (line.endsWith("/")) {
            filesToUnzip = path.join(filesToUnzip, "*");
            icon = "font-awesome:fa-folder";
          }
          archiveContents.push({
            title,
            subtitle,
            archivePath,
            filesToUnzip,
            icon,
            action: "unzip.sh"
          });
        })
    );
  }
  return console.log(JSON.stringify(archiveContents, null, " "));
})();
