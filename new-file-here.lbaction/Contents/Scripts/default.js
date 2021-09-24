function runWithString(input) {
  const pfd = LaunchBar.executeAppleScript(
    'tell application "Finder" to return POSIX path of (insertion location as alias)'
  ).trim();
  const path = input.trim();
  const extension = path.split(".").slice(-1)[0];
  switch (extension) {
    case "code-workspace":
      File.writeJSON(
        {
          folders: [
            {
              path: ".",
            },
          ],
        },
        pfd + "/" + path,
        { prettyPrint: false }
      );
      break;
    default:
      break;
  }
  return [{ path }];
}

// 	".scpt")
// 		cp "./template.scpt" "${full_path}"
// 	chmod +x "${full_path}"
