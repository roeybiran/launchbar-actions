// LaunchBar Action Script

function run(argument) {

	var output = []
	
	var dl_dir = LaunchBar.homeDirectory + '/.Trash/'
	var contents = File.getDirectoryContents(dl_dir, { includeHidden: false });

	// var contents = LaunchBar.execute('downloads-browse-glob.sh').trim()
	// contents = contents.split('\n')

	if (contents.length == 0) {
		return [{
			title: "No downloaded items",
			path: dl_dir,
			icon: 'font-awesome:circle'
		}]
	}

	contents.forEach( function(file) {
		
		var filepath = dl_dir + file
		// var date_added = LaunchBar.execute('/usr/bin/mdls', '-name', 'kMDItemDateAdded', '-raw', filepath)
		// var date_added = LaunchBar.execute('/usr/bin/mdls', '-name', 'kMDItemFSContentChangeDate', '-raw', filepath)
		// date_added = date_added.substr(0, date_added.lastIndexOf(" "));
		
		// LaunchBar.log(date_added)
		// if ((date_added == '') || (date_added == undefined)) {
		// 	var re = /(^[\d-]+)(T)([\d{2,}:]+)/m
		// 	var now = new Date();
		// 	now = now.toISOString()
		// 	now = now.match(re)
		// 	date_added = (now[1] + ' ' + now[3])
		// }

		output.push({
			path: filepath,
			// date_added: date_added
		})

	});

	// output.sort(function (a, b) {
	// 	return a.date_added.localeCompare(b.date_added);
	// });

	output = output.reverse()
	
	if (argument == 'openFirst') {
		path = output[0].path
		path = File.fileURLForPath(path)
		LaunchBar.openURL(path)
	} else {
		return output
	}

}