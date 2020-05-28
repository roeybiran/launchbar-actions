
function runWithString(argument) {
	
    var result = HTTP.get('http://completion.amazon.com/search/complete?method=completion&search-alias=aps&client=amazon-search-ui&mkt=1&fb=1&xcat=0&cf=0&x=updateISSCompletion&sc=1&q=' + encodeURIComponent(argument), 3);

    if (result == undefined) {
        LaunchBar.log('HTTP.getJSON() returned undefined');
        return [];
    }
    if (result.error != undefined) {
        LaunchBar.log('Error in HTTP request: ' + result.error);
        return [];
    }
	
	var matches = result.data.match(/(\[.*\])/);
	if (!(matches && matches[1])) {
		return [];
	}
	var data = JSON.parse(matches[1]);
	
    try {
        var suggestions = [];
        if (data[1]) {
			for (var suggestion in data[1]) {
				suggestions.push({
								 'title' : data[1][suggestion],
								 'icon' : 'Amazon.icns'
								 });
			}
		}
        return suggestions;
    } catch (exception) {
        LaunchBar.log('Exception while parsing result: ' + exception);
        return [];
    }
}
