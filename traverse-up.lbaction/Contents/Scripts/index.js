"use strict";

const tildify = require("tildify");
const fw = require("finder-windows");

(async () => {
  const output = [];
  let inputPaths = process.argv.splice(2);
  if (inputPaths.length === 0) {
    inputPaths = [await fw("first")];
  }
  inputPaths.forEach(inputPath => {
    const pathParts = [];
    // remove trailing '/'. split by '/'
    const splittedPath = inputPath.replace(/\/$/, "").split("/");
    splittedPath.forEach((pathPart, index) => {
      // comment to include the sent folder
      // if (index === splittedPath.length - 1) return;
      pathParts.push(pathPart);
      let reassembledPath = pathParts.join("/");
      if (reassembledPath === "") {
        reassembledPath = "/";
      }
      const lbItem = {
        path: reassembledPath
      };
      output.push(lbItem);
    });
  });
  return console.log(JSON.stringify(output.reverse()));
})();
