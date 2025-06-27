#!/bin/sh
#
# LaunchBar Action Script
#

osascript << 'EOF'
tell application "LaunchBar"
	update every indexing rule
	activate
end tell
EOF