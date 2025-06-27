// LaunchBar Action Script

// - "stat" is not a proper reflection of Finder's "date added" data (e.g.  changes on renames), but good enough for our needs.
// - "mdls" is better but doesn't work for trashed files.
// - The ideal solution is Foundation's "URLResourceKey.addedToDirectoryDateKey", but getting Swift scripts to work in LaunchBar is to much of a hassle.

function getRecents(path, subtitlePrefix) {
  //   const dates = LaunchBar.execute(
  //     "/usr/bin/mdls",
  //     "-attr",
  //     "kMDItemDateAdded",
  //     ...paths
  //   )
  //     .split("\n")
  //     .map((line) => {
  //       const [, dateString = ""] = line.split(" = ");
  //       const parsedDate = new Date(
  //         dateString.replace(" ", "T").replace(" +0000", "Z")
  //       );
  //       if (!isNaN(parsedDate.getTime())) {
  //         return parsedDate;
  //       } else {
  //         return undefined;
  //       }
  //     });

  const excluded = [".DS_Store", ".localized"];
  const contents = File.getDirectoryContents(path, {
    includeHidden: true,
  }).filter((name) => !excluded.includes(name));
  const paths = contents.map((name) => `${path}/${name}`);
  const dates = LaunchBar.execute("/usr/bin/stat", "-f", "%c", ...paths)
    .split("\n")
    .map((line) => {
      const timestamp = parseInt(line.trim());
      if (!isNaN(timestamp)) {
        return new Date(timestamp * 1000);
      } else {
        return undefined;
      }
    });

  return contents
    .map((name, index) => ({
      path: `${path}/${name}`,
      date: dates[index] ?? new Date(0),
    }))
    .sort((a, b) => b.date - a.date)
    .map((item) => ({
      path: item.path,
      subtitle: `${subtitlePrefix} ${LaunchBar.formatDate(item.date, {
        relativeDateFormatting: true,
      })}`,
    }));
}
