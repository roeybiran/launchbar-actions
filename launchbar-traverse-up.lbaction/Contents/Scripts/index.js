"use strict";

const tildify = require("tildify");
const fw = require("finder-windows");

(async () => {
  const output = [];
  // all the paths sent from lb
  let inputPaths = process.argv.splice(2);
  // if no paths(=args), use the frontmost finder window as an argument
  if (inputPaths.length === 0) {
    inputPaths = [await fw("first")];
  }
  inputPaths.forEach(inputPath => {
    const breadcrumbs = [];
    // remove trailing '/' and split by '/'
    const splittedPath = inputPath.replace(/\/$/, "").split("/");
    splittedPath.forEach((pathBreadcrumb, index) => {
      // store each path part as an array
      breadcrumbs.push(pathBreadcrumb);
      // join current path parts with /
      let assembledPath = breadcrumbs.join("/");
      // the root directory
      if (assembledPath === "") {
        assembledPath = "/";
      }
      assembledPath = tildify(assembledPath);
      // store joined path parts for script output
      const lbItem = {
        title: assembledPath,
        subtitle: "",
        path: assembledPath
      };
      // base folder is the argument, and the last folder in the splitted path array
      if (index === splittedPath.length - 1) {
        lbItem.badge = "Base Folder";
      }
      output.push(lbItem);
    });
  });
  // reverse so / comes last
  return console.log(JSON.stringify(output));
})();
