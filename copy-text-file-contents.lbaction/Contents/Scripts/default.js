// LaunchBar Action Script

// copies the contents of 1 or more text files to the clipboard, linefeed-delimited

function runWithPaths(paths) {
  const texts = paths
    .map(path => {
      return File.readText(path);
    })
    .join("\n");
  LaunchBar.setClipboardString(texts);
  return texts
}
