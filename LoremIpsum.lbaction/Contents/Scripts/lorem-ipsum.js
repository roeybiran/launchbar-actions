// LaunchBar Action Script

function runWithString(string) {

    var args = string.split(' ')
    var count = args[0]
    var units = args[1].charAt(0)


    switch (units) {
    	case 'w':
    		var units = 'words'
    		break;
    	case 's':
    		var units = 'sentences'
    		break;
		case 'p':
			var units = 'paragraphs'
    }

    var output = LaunchBar.execute('/usr/local/bin/node', '/usr/local/lib/node_modules/lorem-ipsum/bin/lorem-ipsum.bin.js', '--units', units, '--count', count, '--format', 'plain')
    LaunchBar.paste(output)
}
