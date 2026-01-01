#!/bin/sh
#
# LaunchBar Action Script
#

osascript <<'EOF'
    tell application "System Events"
        tell process "LaunchBar"
            set frontmost to true
            tell window 1 to key code 53
            delay 0.1
            tell application "LaunchBar" to remain active
            set frontmost to true
            delay 0.1
            keystroke "I" using {shift down, command down}
        end tell
    end tell
EOF
