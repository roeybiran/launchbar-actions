// LaunchBar Action Script

include('getCurrentDfxFolder.js')
include('formatPathForOutput.js')

function run() {

	var output = []
	var selection = LaunchBar.executeAppleScriptFile('default-folder-x-selection.scpt').trim().split('\n')

	selection.forEach( function(selected) {
		selected = formatPathForOutput(selected)
		output.push({
			title: selected['name'],
			subtitle: selected['shortPosixPath'],
			badge: "Selected",
			path: selected['posixPath']
		})
	});

	var currentDfxFolder = getCurrentDfxFolder()
	currentDfxFolder = formatPathForOutput(currentDfxFolder)
	output.push({
		title: currentDfxFolder['name'],
		subtitle: currentDfxFolder['shortPosixPath'],
		path: currentDfxFolder['posixPath'],
		badge: "Folder"
	})
	return output
}
