// LaunchBar Action Script

function getCurrentDfxFolder() {
	var currentDfxFolder = LaunchBar.executeAppleScriptFile('/Applications/LaunchBar.app/Contents/Resources/Actions/Shared Scripts/getCurrentDfxFolder.scpt').trim()
    return currentDfxFolder
}

