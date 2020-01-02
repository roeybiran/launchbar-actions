#!/bin/sh
#
# LaunchBar Action Script
#

/usr/bin/osascript - "${1}" <<-EOF
		on run argv
		tell application "LaunchBar" to hide
		delay 0.5
		tell application "Default Folder X" to SwitchToFolder (item 1 of argv)
	end run
EOF
