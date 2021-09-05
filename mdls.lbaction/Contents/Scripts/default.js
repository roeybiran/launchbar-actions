// LaunchBar Action Script

function run(path) {
  return Object.entries(
    Plist.parse(LaunchBar.execute("/usr/bin/mdls", "-plist", "-", path))
  ).map(([key, value]) => {
    let children = [];
    if (Array.isArray(value) && value.length > 1) {
      children = value.map((v) => ({ title: String(v) }));
    }
    return { title: String(value), subtitle: key, children };
  });
}
