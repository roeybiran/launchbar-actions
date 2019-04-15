// LaunchBar Action Script

function run() {
	
	include('getFinderWindows.js')

	var output = []
	var dirs = []
	var files = []

	var path = getFirstFinderWindow()

	if (path == undefined) {
		return [{
			title: 'Can\'t Browse Current Folder!',
			icon: 'font-awesome:warning'
		}]
	}

	var contents = File.getDirectoryContents(path, { includeHidden: false });
	// case-insensitive sort
	contents = contents.sort(function (a, b) {
    	return a.toLowerCase().localeCompare(b.toLowerCase());
	});
	
	contents.forEach( function(element) {
		item = path + '/' + element
		if (File.isDirectory(item) && !item.endsWith('.app') && !item.endsWith('.pkg')) {
			dirs.push({
				path: item
			})
		} else {
			files.push({
				path: item
			})
		}	
	});

	output = dirs.concat(files)
	return output

}
