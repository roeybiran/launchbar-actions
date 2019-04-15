// LaunchBar Action Script

// copies the contents of 1 or more text files to the clipboard, linefeed-delimited

function runWithPaths(paths) {

	var texts = []
	
    paths.forEach( function(element) {
    	var text = File.readText(element)
    	texts.push(text)
    });

LaunchBar.setClipboardString(texts.join('\n'))
LaunchBar.paste(texts)
LaunchBar.execute('/usr/bin/afplay', '/System/Library/Sounds/Pop.aiff')

}

