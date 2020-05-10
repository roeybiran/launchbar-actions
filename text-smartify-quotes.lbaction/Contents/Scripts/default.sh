#!/bin/bash

lines=()
for line in "${@}"; do
	output="$(printf "%s\n" "${line}" | sed 's/"/”/g')"
	lines+=("${output}")
done

if [[ "${LB_OPTION_COMMAND_KEY}" == "1" ]]; then
	echo "${lines[@]}"
	exit
fi
osascript - "${lines[@]}" <<-EOF
	on run argv
		tell app "LaunchBar"
			hide
			paste in frontmost application (item 1 of argv)
		end tell
	end run
EOF
