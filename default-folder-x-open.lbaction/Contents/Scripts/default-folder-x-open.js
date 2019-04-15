// LaunchBar Action Script

function runWithPaths(paths) {
	LaunchBar.hide()
	var thePath = paths[0]
	if (LaunchBar.options.shiftKey) {
		LaunchBar.executeAppleScriptFile('default-folder-x-open.scpt', thePath, 'open')
	} else {
		LaunchBar.executeAppleScriptFile('default-folder-x-open.scpt', thePath, 'reveal')
	}	 
};
