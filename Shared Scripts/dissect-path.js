// LaunchBar Action Script

function dissectPath (filename) {
	var basename = LaunchBar.execute('/usr/bin/basename', filename).trim()
	var dirname = LaunchBar.execute('/usr/bin/dirname', filename).trim()
	var file = basename.split('.')
	var ext = file[file.length-1]
	var name = file.slice(0, file.length-1)
	var file = {
		ext: ext,
		name: name,
		dir: dirname
	}
	return file
}
