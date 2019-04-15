// LaunchBar Action Script

include('getFinderWindows.js')
include('formatPathForOutput.js')

function run() {

	var output = []
    var openFinderWindows = getAllFinderWindows()
    openFinderWindows.forEach( function(finderWindow) {
    	var finderWindow = formatPathForOutput(finderWindow)
    	output.push({
    		title: finderWindow['name'],
    		path: finderWindow['posixPath'],
            subtitle: finderWindow['shortPosixPath'],
    		badge: 'Open'
    	})
    });

    var recentFinderWindows = LaunchBar.executeAppleScriptFile('default-folder-x-finder-windows.scpt')
    recentFinderWindows = recentFinderWindows.trim().split('\n')

    recentFinderWindows.forEach( function(finderWindow) {
        var finderWindow = formatPathForOutput(finderWindow)
        output.push({
            title: finderWindow['name'],
            path: finderWindow['posixPath'],
            subtitle: finderWindow['shortPosixPath'],
            badge: 'Recent'
        })
    });


    return output
}
