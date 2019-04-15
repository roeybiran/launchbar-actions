// LaunchBar Action Script

function runWithString(directions) {
	var directions = directions.split(' to ')
	if (directions.length == 1) {
		var placeA = 'current%20location'
		var placeB = encodeURI(directions[0])
	} else {
		var placeA = encodeURI(directions[0])
		var placeB = encodeURI(directions[1])
	}

	// LaunchBar.log(placeA + '>' + placeB)
	LaunchBar.openURL('https://www.google.com/maps/dir/' + placeA + '/' + placeB)
};