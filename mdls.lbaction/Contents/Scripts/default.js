// LaunchBar Action Script

function run(path) {
  let plist = LaunchBar.execute("/usr/bin/mdls", "-plist", "-", path);
  try {
    plist = Plist.parse(plist);
  } catch (error) {
    return LaunchBar.execute("/usr/bin/mdls", path)
      .trim()
      .split("\n")
      .map((l) => ({ title: l }));
  }
  return Object.entries(plist).map(([key, value]) => ({
    title: key,
    subtitle: Array.isArray(value) ? "" : String(value),
    children: Array.isArray(value)
      ? value.map((v) => ({ title: String(v) }))
      : [],
  }));
}
