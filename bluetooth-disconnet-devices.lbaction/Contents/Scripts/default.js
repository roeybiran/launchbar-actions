function run() {
  JSON.parse(
    LaunchBar.execute("/usr/local/bin/blueutil", "--paired", "--format", "json")
  )
    .filter((device) => device.connected)
    .forEach((device) =>
      LaunchBar.execute(
        "/usr/local/bin/blueutil",
        "--disconnect",
        device.address
      )
    );
}
