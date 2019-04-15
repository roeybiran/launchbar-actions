// LaunchBar Action Script

function groupBy(argument) {
        LaunchBar.executeAppleScriptFile('./finder-group-by.scpt', argument);
}

function run() {
    var output = [];
    var columnsArray = ['None', 'Name', 'Kind', 'Date Last Opened', 'Date Added', 'Date Modified', 'Date Created', 'Size', 'Tags']
    var columnsArrayLength = columnsArray.length;

    for (var i = 0; i < columnsArrayLength; i++) {
    // alert(myStringArray[i]);
	    output.push({
	    title: columnsArray[i],
	    actionArgument: columnsArray[i],
	    icon: 'com.apple.finder',
	    action: 'groupBy',
	    actionRunsInBackground: true,
	    actionReturnsItems: false
		});
	}

    return output
}