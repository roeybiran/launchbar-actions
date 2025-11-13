// LaunchBar Action Script

// credit: https://www.raycast.com/huzef44/screenocr

function run() {
  const fullScreen = LaunchBar.options.shiftKey;
  let args = [
    "/usr/bin/env",
    "swift",
    `${Action.path}/Contents/Scripts/RecognizeText/Sources/main.swift`,
    fullScreen ? "--full-screen" : "",
    "--languages=en-US,he"
  ];
  LaunchBar.hide();
  let result = LaunchBar.execute(...args);
  return result
    .trim()
    .split("\n")
    .map((line) => ({ title: line }));
}
