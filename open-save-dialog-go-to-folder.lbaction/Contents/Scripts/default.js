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

function goToFolder(theFolder) {
  LaunchBar.hide();
  LaunchBar.setClipboardString(theFolder);
  LaunchBar.executeAppleScript(
    'tell application "System Events"',
    "key code 5 using {command down, shift down}",
    "key code 9 using command down",
    "key code 36",
    "end tell"
  );
}
