// LaunchBar Action Script

function runWithPaths(paths) {
  return JSON.parse(
    LaunchBar.execute(
      `${Action.path}/Contents/Scripts/DirectoryWalker`,
      ...paths
    )
  ).map((x) => {
    return {
      title: x.name,
      subtitle: x.relativePath,
      path: x.absolutePath,
    };
  });
}
