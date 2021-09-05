// LaunchBar Action Script

function runWithString(theString) {
  return LaunchBar.execute(
    "/usr/bin/mdfind",
    `((** = "${theString}*"cdw) && (_kMDItemGroupId = 9))`
  )
    .trim()
    .split("\n")
    .map((path) => {
      return {
        path,
        title: File.displayName(path),
        subtitle: path,
        action: "goToFolder",
        actionArgument: path,
      };
    });
}

function runWithPaths(paths) {
  goToFolder(paths[0]);
}

function goToFolder(theFolder) {
  LaunchBar.hide();
  LaunchBar.executeAppleScript(
    'tell app "System Events"',
    "key code 5 using {command down, shift down}",
    "delay 0.3",
    "key code 51",
    "end tell"
  );
  LaunchBar.paste(theFolder);
  LaunchBar.executeAppleScript(
    "delay 0.1",
    'tell app "System Events" to key code 76'
  );
}
