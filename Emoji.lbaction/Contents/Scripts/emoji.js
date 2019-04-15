// LaunchBar Action Script

function pasteItem(argument) {
	LaunchBar.paste(argument);
}

function runWithString(string) {
	var output = []
	var allEmojis = []
	var search = string;
	var query = encodeURIComponent(search);
	var result = HTTP.getJSON('https://emoji.getdango.com/api/emoji?q=' + query);
	if (result.data != undefined) {
	    var emojis = result.data.results;
	    emojis.forEach(function(emoji) {
	    	var emoji = emoji.text
	    	allEmojis.push(emoji)
	    	output.push({
	    		title: string,
	    		icon: emoji,
	    		action: 'pasteItem',
	    		actionArgument: emoji,
	    		actionReturnsItems: false,
				actionRunsInBackground: true
	    	});
	    });
	    allEmojis = allEmojis.join('')
	    output.push({
	    		title: allEmojis,
	    		icon: allEmojis,
	    		action: 'pasteItem',
	    		actionArgument: allEmojis,
	    		actionReturnsItems: false,
				actionRunsInBackground: true
	    })
	} else if (result.error != undefined) {
	    LaunchBar.alert('Unable to load results for "' + search + '"', result.error);
	}
	
	return output
	
}