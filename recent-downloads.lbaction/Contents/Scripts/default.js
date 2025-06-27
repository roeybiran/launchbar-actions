// LaunchBar Action Script

include("getRecents.js");

function run(argument) {
  return getRecents(`${LaunchBar.homeDirectory}/Downloads`, "Downloaded");
}
