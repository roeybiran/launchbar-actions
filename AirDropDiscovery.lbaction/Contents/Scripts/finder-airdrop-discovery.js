// LaunchBar Action Script

function airDrop(argument) {
	LaunchBar.hide()
    LaunchBar.executeAppleScriptFile('./finder-airdrop-discovery.scpt', argument);
}

function run() {
    var output = [];
    var airDropStates = ['No One', 'Contacts Only', 'Everyone']
    var airDropStatesLength = airDropStates.length;
    for (var i = 0; i < airDropStatesLength; i++) {
    // alert(myStringArray[i]);
	    output.push({
	    title: airDropStates[i],
	    actionArgument: airDropStates[i],
	    icon: '/System/Library/CoreServices/Finder.app/Contents/Applications/AirDrop.app/Contents/Resources/OpenAirDropAppIcon.icns',
	    action: 'airDrop',
	    actionRunsInBackground: true,
	    actionReturnsItems: false
		});
	}
    return output
}