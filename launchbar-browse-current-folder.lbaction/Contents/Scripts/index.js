"use strict";

const fw = require("finder-windows");
const shallowGlob = require("@roeybiran/shallow-glob");

(async () => {
  try {
    const frontmostFinderWindow = await fw("first");
    const paths = await shallowGlob(frontmostFinderWindow, {
      sort: "kind"
    });
    return console.log(
      JSON.stringify(
        paths.map(x => {
          return { path: x };
        }),
        null,
        " "
      )
    );
  } catch (error) {
    return console.log(error);
  }
})();
