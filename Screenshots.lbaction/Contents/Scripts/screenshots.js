// LaunchBar Action Script

function screenshot(argument) {
	LaunchBar.hide()
	LaunchBar.execute('screenshots.sh', argument)
};

function run(argument) {

	var output = []
	
	var objects = [
		{title: 'Capture Selection to Clipboard', arg: '--capture-selection-to-clipboard'},
		{title: 'Capture Selection to Desktop', arg: '--capture-selection-to-desktop'},
		// {title: 'Capture Selection to Preview', arg: '--capture-selection-to-preview'},
		{title: 'Capture Screen to Desktop', arg: '--capture-screen-to-desktop'},
		{title: 'Capture Selection to Desktop + Annotation', arg: '--capture-selection-to-desktop-annotation'},
		{title: 'Capture Screen to Desktop + Annotation', arg: '--capture-screen-to-desktop-annotation'},
		{title: 'Record Screen to Desktop + Annotation', arg: '--record-screen-to-desktop-annotation'},
		{title: 'Record Selection to Desktop + Annotation', arg: '--record-selection-to-desktop-annotation'}
	]

	objects.forEach( function(object) {
		output.push({
		title: object['title'],
		action: 'screenshot',
		actionArgument: object['arg'],
		actionReturnsItems: false,
		actionRunsInBackground: true,
		icon: 'com.apple.screenshot.launcher'
		})
	});
	return output
};







