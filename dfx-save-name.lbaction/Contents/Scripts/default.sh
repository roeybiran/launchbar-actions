#!/bin/bash

# if [[ -z "${1}" ]]
# then
# 	current_name="$(osascript -e 'tell application "Default Folder X" to return GetSaveName')"
# 	echo "Current save name is: ${current_name}"
# 	exit 0
# fi

osascript - "${1}" <<-EOF
	on run argv
		tell application "Default Folder X" to SetSaveName (item 1 of argv)
	end run
EOF
