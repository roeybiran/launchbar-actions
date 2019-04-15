// LaunchBar Action Script

function run() {
    if (LaunchBar.options.controlKey && LaunchBar.options.alternateKey && LaunchBar.options.commandKey) {
        LaunchBar.LaunchBar.executeAppleScriptFile('restart-finder.scpt')
    } else {
        LaunchBar.execute('/usr/bin/killall', 'Finder')
    }
}
