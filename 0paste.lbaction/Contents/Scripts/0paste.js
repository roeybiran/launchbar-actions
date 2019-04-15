// LaunchBar Action Script

function runWithString(string) {
	LaunchBar.paste(string)
	LaunchBar.execute('/bin/sleep', '0.2')
	LaunchBar.clearClipboard()
};