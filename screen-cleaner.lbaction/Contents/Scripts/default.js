// LaunchBar Action Script

function run(argument) {
    let path = Action.path + "/Contents/Scripts/Screen Cleaner/Screen Cleaner/main.swift";
    LaunchBar.execute("/usr/bin/swift", path);
}
