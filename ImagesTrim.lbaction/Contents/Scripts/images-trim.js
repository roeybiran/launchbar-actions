// LaunchBar Action Script

function runWithPaths(paths) {
	paths.forEach( function(element) {
		if (LaunchBar.options.shiftKey) {
			LaunchBar.execute('images-trim.sh', '--overwrite', element)
		} else {
			LaunchBar.execute('images-trim.sh', '--copy', element)
		}
	});
};

