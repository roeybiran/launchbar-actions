function run() {
  const path = LaunchBar.executeAppleScript(
    'tell application "Finder" to POSIX path of (insertion location as alias)'
  )
    .split("/")
    .filter(x => x !== "");
  return path
    .map((_, idx) => {
      return { path: `/${path.slice(0, idx).join("/")}` };
    })
    .reverse();
}
