#!/bin/sh

osascript - "$(printf "%s" "${1}" | tr '[:upper:]' '[:lower:]')" <<-EOF
	on run argv
		tell app "LaunchBar" to paste in frontmost application (item 1 of argv)
	end run
EOF
