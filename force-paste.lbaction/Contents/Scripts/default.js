// LaunchBar Action Script

forcePaste = text => {
    LaunchBar.executeAppleScript(`tell application "System Events" to keystroke "${text}"`)
}

run = () => {
    forcePaste(LaunchBar.getClipboardString())
}

runWithString = string => {
    forcePaste(string)
}
