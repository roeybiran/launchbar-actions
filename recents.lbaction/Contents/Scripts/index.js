"use strict";

const lb = require("launchbar-node");
const { execFile } = require("@roeybiran/task");

// http://blog.clawpaws.net/post/2007/02/11/Making-OS-X-Fat-Binaries-with-Traditional-Tools
// https://hacksformacs.wordpress.com/2015/01/12/spotlight-on-the-command-line-part-1-introducing-mdfind-and-xargs/
// https://hacksformacs.wordpress.com/2015/01/28/spotlight-on-the-command-line-part-2-improving-searches/

(async () => {
  try {
    if (lb.env.shiftKey) {
      lb.hide();
      const script = `
      tell application "Finder"
        activate
        if name of first Finder window is "Recents" then
          return
        else
          set winList to every Finder window
          repeat with aWindow in winList
            tell aWindow
              if name = "Recents" and URL of target = "" then
                set index of aWindow to 1
                return
              end if
            end tell
          end repeat
        end if
      end tell
      tell application "System Events"
        tell process "Finder"
          set frontmost to true
          keystroke "f" using {shift down, command down}
        end tell
    end tell`;
      await execFile("/usr/bin/osascript", ["-e", script]);
      process.exit();
    }

    // kMDItemLastUsedDate
    // kMDItemDateAdded
    // kMDItemContentModificationDate
    // kMDItemFSContentChangeDate

    const query = [
      "(",
      "(kMDItemLastUsedDate >= $time.today(-7))",
      "&&",
      "(kMDItemContentTypeTree != com.apple.application)",
      "&&",
      "(",
      "(kMDItemContentTypeTree=public.archive)",
      "||",
      "(kMDItemContentTypeTree = public.content)",
      "||",
      "(_kMDItemGroupId = 8)",
      "||",
      "(_kMDItemGroupId = 9)",
      "||",
      "(_kMDItemGroupId = 13)",
      "||",
      "(_kMDItemGroupId = 7)",
      "||",
      "(_kMDItemGroupId = 10)",
      "||",
      "(_kMDItemGroupId = 11)",
      "||",
      "(_kMDItemGroupId = 12)",
      "||",
      "(kMDItemContentTypeTree = public.text)",
      ")",
      ")"
    ];

    if (process.argv[2]) {
      process.argv.splice(2).forEach(folder => {
        query.push("-onlyin", folder);
      });
    }

    const { stdout } = await execFile("/usr/bin/mdfind", query);
    let results = stdout.split("\n");

    if (results.length < 20) {
      query[1] = "(kMDItemDateAdded >= $time.today(-7))";
      const secondRun = await execFile("/usr/bin/mdfind", query);
      results = results.concat(secondRun.stdout.split("\n"));
    }
    console.log(
      JSON.stringify(
        results.map(path => {
          return { path };
        })
      )
    );
  } catch (error) {
    console.log(error);
  }
})();
