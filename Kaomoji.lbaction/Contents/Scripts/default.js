// LaunchBar Action Script

function pasteItem(argument) {
	LaunchBar.paste(argument);
}

function runWithString(string) {
	var output = []
	var search = string;
	var query = encodeURIComponent(search);
	var result = HTTP.getJSON('https://customer.getdango.com/dango/api/query/kaomoji?q=' + query);
	if (result.data != undefined) {
	    var kaomojis = result.data.items;
	    kaomojis.forEach(function(kaomojiObject) {
	    	var kaomoji = kaomojiObject.text
	    	output.push({
	    		title: kaomoji,
	    		action: 'pasteItem',
	    		actionArgument: kaomoji,
	    		actionReturnsItems: false,
				actionRunsInBackground: true
	    	});
	    });
	} else if (result.error != undefined) {
	    LaunchBar.alert('Unable to load results for "' + search + '"', result.error);
	}
	
	return output
	
	//  https://emoji.getdango.com/api/emoji?q=
	// {"results": [{"text": "😡", "score": 0.14190006256}, {"text": "😤", "score": 0.043543644249}, {"text": "😠", "score": 0.036553010345}, {"text": "😒", "score": 0.03386580199}, {"text": "😑", "score": 0.02776402235}, {"text": "👿", "score": 0.024746535346}, {"text": "😐", "score": 0.015217738226}, {"text": "😂", "score": 0.012138772756}, {"text": "👊", "score": 0.011408733204}, {"text": "😾", "score": 0.01135505829}]}
	
}