// LaunchBar Action Script

include('formatPathForOutput.js') 

function run() {

	var output = []
	var dl_dir = LaunchBar.homeDirectory + '/Downloads/'
	var contents = File.getDirectoryContents(dl_dir, { includeHidden: false });
	// var contents = LaunchBar.execute('downloads-browse-glob.sh').trim()
	// contents = contents.split('\n')
	if (contents.length == 0) {
		return [{
			title: "No downloaded items",
			icon: 'font-awesome:fa-warning'
		}]
	}

	contents.forEach( function(file) {
		
		var path = dl_dir + file
		var date_added = LaunchBar.execute('/usr/bin/mdls', '-name', 'kMDItemDateAdded', '-raw', path)
		date_added = date_added.substr(0, date_added.lastIndexOf(" "));
		// LaunchBar.log(date_added)
		if ((date_added == '') || (date_added == undefined)) {
			var re = /(^[\d-]+)(T)([\d{2,}:]+)/m
			var now = new Date();
			now = now.toISOString()
			now = now.match(re)
			date_added = (now[1] + ' ' + now[3])
		}
		path = formatPathForOutput(path)
		output.push({
			title: path['name'],
			path: path['posixPath'],
			subtitle: 'Added on ' + date_added.toString()
		})
	});

	output.sort(function (a, b) {
		return a.subtitle.localeCompare(b.subtitle);
	});

	output = output.reverse()
	
	if (LaunchBar.options.shiftKey) { // open most recent download
		path = output[0].path
		path = File.fileURLForPath(path)
		LaunchBar.openURL(path)
	} else {
		return output
	}
}
