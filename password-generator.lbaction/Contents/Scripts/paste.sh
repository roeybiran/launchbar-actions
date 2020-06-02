#!/bin/sh

echo "${1}" | pbcopy
osascript -e "tell app \"LaunchBar\" to paste in frontmost application \"${1}\""
(
	sleep 15
	echo "" | pbcopy
	osascript -e 'tell app "LaunchBar" to display in notification center "Clipboard cleared"'
) &
