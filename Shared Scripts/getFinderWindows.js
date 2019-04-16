// LaunchBar Action Script

function getFirstFinderWindow() {
	var finderWindows = LaunchBar.executeAppleScriptFile('/Applications/LaunchBar.app/Contents/Resources/Actions/Shared Scripts/getFinderWindows.scpt', 'first')
	finderWindows = finderWindows.trim().split('\n')
    return finderWindows
}

function getAllFinderWindows() {
	var finderWindows = LaunchBar.executeAppleScriptFile('/Applications/LaunchBar.app/Contents/Resources/Actions/Shared Scripts/getFinderWindows.scpt', 'all')
	finderWindows = finderWindows.trim().split('\n')
    return finderWindows
}
