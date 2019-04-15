// LaunchBar Action Script

// function run(argument) {
//     if (argument == undefined) {
//         // Inform the user that there was no argument
//         LaunchBar.alert('No argument was passed to the action');
//     } else {
//         // Return a single item that describes the argument
//         return [{ title: '1 argument passed'}, { title : argument }];
//     }
// }

function toggleColumns(argument) {
        LaunchBar.executeAppleScriptFile('./finder-toggle-columns.scpt', argument);
}

function run() {
    var output = [];
    var columnsArray = ['iCloud Status', 'Date Modified', 'Date Created', 'Date Last Opened', 'Date Added', 'Size', 'Kind', 'Version', 'Comments', 'Tags']
    var columnsArrayLength = columnsArray.length;

    for (var i = 0; i < columnsArrayLength; i++) {
    // alert(myStringArray[i]);
	    output.push({
	    title: columnsArray[i],
	    actionArgument: columnsArray[i],
	    icon: 'com.apple.finder',
	    action: 'toggleColumns',
	    actionRunsInBackground: true,
	    actionReturnsItems: false
		});
	}

    return output
}