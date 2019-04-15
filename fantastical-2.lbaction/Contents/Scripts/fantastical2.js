// LaunchBar Action Script

function run() {
    if (LaunchBar.options.shiftKey == true) {
    	// show the full app
		LaunchBar.openURL('file:///Applications/Fantastical%202.app/')
    } else {
    	// show the mini window
        LaunchBar.executeAppleScript('tell application id "com.flexibits.fantastical2.mac" to parse sentence ""')
    }
}
