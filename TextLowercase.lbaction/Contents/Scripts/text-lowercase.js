// LaunchBar Action Script

function runWithString(string) {
	var text = string.toLowerCase()
	LaunchBar.paste(text)
	LaunchBar.execute('/bin/sleep', '0.2')
	LaunchBar.clearClipboard()
}
