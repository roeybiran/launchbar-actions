function runWithString(input) {
  const pfd = LaunchBar.executeAppleScript(
    'tell application "Finder" to return POSIX path of (insertion location as alias)'
  ).trim();
  const name = input.trim();
  const extension = name.split(".").slice(-1)[0];
  const path = pfd + "/" + name;
  let content;
  switch (extension) {
    // special handling for extensions...
    case "scpt":
      // cp "./template.scpt" "${full_path}"
      break;
    default:
      break;
  }
  File.writeText(content ?? "", path);
  // 	chmod +x "${full_path}"
  return [{ path }];
}
