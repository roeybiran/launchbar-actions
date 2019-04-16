// LaunchBar Action Script

function copyAndPaste(string) {
	LaunchBar.paste(string)
	LaunchBar.execute('/bin/sleep', '0.2')
	LaunchBar.setClipboardString(string);
}

function justPaste(string) {
	LaunchBar.paste(string)
	LaunchBar.execute('/bin/sleep', '0.2')
	LaunchBar.clearClipboard();
}
