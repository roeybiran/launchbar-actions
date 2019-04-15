// LaunchBar Action Script

function run() {

	var output = []
    var recentFolders = LaunchBar.executeAppleScriptFile('default-folder-x-recent-folders.scpt')
	recentFolders = recentFolders.split('\n')
    recentFolders.forEach( function(path) {
    	output.push({ path: path })
    });

    return output
}
