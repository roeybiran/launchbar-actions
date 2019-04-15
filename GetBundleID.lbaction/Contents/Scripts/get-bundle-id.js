// LaunchBar Action Script

function runWithPaths(paths) {
	var bundleids = []
	// the regex to match the bundle id
	var re = /^kMDItemCFBundleIdentifier\s+= "(.+)"$/m;
	
	paths.forEach( function(element) {
		// mdls command
		var bundleid = LaunchBar.execute('/usr/bin/mdls', element)
		// the 'match' method returns an array
		bundleid = bundleid.match(re)
		// element 0 is the whole match, the next is the capture group
		bundleids.push(bundleid[1])
	});

	if (LaunchBar.options.shiftKey) {
		bundleids = bundleids.join('\n')
	} else {
		bundleids = bundleids.join(' ')
	}

	LaunchBar.paste(bundleids)
	// putting the string to the clipboard won't work without this small delay
	LaunchBar.execute('/bin/sleep', '0.5')
	LaunchBar.setClipboardString(bundleids)
	
}
