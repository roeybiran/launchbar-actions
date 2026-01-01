#!/bin/sh
#
# LaunchBar Action Script
#

osascript <<'EOF'
tell application "Safari" to activate
tell application "System Events" to click menu item "New Private Window" of menu 1 of menu bar item "File" of menu bar 1 of application process "Safari"
EOF
