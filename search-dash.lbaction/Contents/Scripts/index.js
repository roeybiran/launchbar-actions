"use strict";

const parser = require("fast-xml-parser");
const cp = require("child_process");
const path = require("path");

// https://kapeli.com/dash_plugins
// /Applications/LaunchBar.app/Contents/Resources/Actions/Search Dash.lbaction/Contents/Scripts/default.rb

const query = process.argv[2] || process.exit(0);

const DASH_PATH = "/Applications/Dash.app";
const DASH_WORKFLOW = "/Contents/Resources/dashAlfredWorkflow";
const dashPlugin = path.join(DASH_PATH, DASH_WORKFLOW);

const output = cp.execFileSync(dashPlugin, [query], { encoding: "utf-8" });

const jsonObj = parser.parse(output);
const actualDocsItems = jsonObj.output.items.item;

/*
Normally, this script is run for live feedback and returns items that are
opened using open.sh. But if the user hits enter before a previous run of
this script could return any items (e.g. because nothing was found or the
"dash" utility takes too long), this script is not run for live feedback
and Dash should just be opened with the current search term instead.
 */
if (process.env.LB_OPTION_LIVE_FEEDBACK === "0") {
  cp.execFileSync("/usr/bin/open", ["-g", `dash://${query}`]);
  process.exit(0);
}

console.log(
  JSON.stringify(
    actualDocsItems.map((x, index) => {
      return {
        title: x.title,
        subtitle: x.subtitle[x.subtitle.length - 1],
        icon: x.icon,
        action: "open.sh",
        actionArgument: index.toString(),
        actionRunsInBackground: true,
        actionReturnsItems: false
      };
    })
  )
);
