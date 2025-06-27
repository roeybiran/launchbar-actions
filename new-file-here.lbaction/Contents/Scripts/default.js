function runWithString(input) {
  const pfd = LaunchBar.executeAppleScript(
    'tell application "Finder" to return POSIX path of (insertion location as alias)'
  ).trim();
  const name = input.trim();
  const path = pfd + "/" + name;
  File.writeText("", path);
  return [{ path }];
}
