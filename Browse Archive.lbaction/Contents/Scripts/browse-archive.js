// LaunchBar Action Script

function uncompress (argument) {
	var argument = argument.split('\n')
	var archive = argument[0]
	var file = argument[1]
	LaunchBar.execute('/usr/bin/unzip', '-B', archive, file, '-d', '/Users/roey/Desktop')
}

function runWithPaths(paths) {

	var output = []
	paths.forEach( function(archive) { // archives are sent to launchbar

		var contents = LaunchBar.execute('/usr/bin/unzip', '-l', archive) // list each archive's content
		contents = contents.split('\n') // split contents on newlines
		contents.splice(0, 3) // remove first 3 lines
		contents.length = contents.length - 3 // remove last 3 lines (last line is blank)

		contents.forEach( function(file) { // for each line ( =file)
			file = file.replace(/^\s+\d+\s+\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}\s{3}/, '')
			
			// clean up output
			var re = /^.+(.pkg|.app|.framework|.xcodeproj)\/.+/ // don't show file package contents
			var re2 = /__MACOSX.?/ // don't push files beginning with __MACOSX

			if (! (re.test(file) || re2.test(file)) ) {
				output.push({
					title: file,
					subtitle: archive,
					action: 'uncompress',
					actionArgument: archive + '\n' + file
				})
			}
		});
	});
	return output
}
