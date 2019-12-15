#!/bin/bash
#
# LaunchBar Action Script
#

# requires ripgrep

if ! [[ -e /usr/local/bin/rg ]]
then
	exit 1
fi

# set -x

for f in "${@}"
do

	if [[ "${f}" == *".spoon" ]]
	then
		script="${f}/init.lua"
	else
		# if an .lbaction is sent
		if ! [[ -d "${f}" ]]; then
			# if the action object itself is sent, search for its name
			plist="$(/usr/local/bin/rg --no-ignore --files-with-matches --glob "Info.plist" -- "<string>${f}</string>" "$HOME/Library/Application Support/LaunchBar/Actions/")"
		else
			plist="${f}/Contents/Info.plist"
		fi

		if [[ -z "${plist}" ]] && ! [[ -f "${plist}" ]]
		then
			/usr/bin/osascript -e "display notification \"Could not find default script for ${f}\""
			continue
		elif [[ $(printf "%s\n" "${plist}" | wc -l) -gt 1 ]]
		then
			/usr/bin/osascript -e 'display notification "Found multiple actions with similar default script"'
			continue
		fi

		script_name=$(/usr/libexec/PlistBuddy -c "Print :LBScripts:LBDefaultScript:LBScriptName" "${plist}")
		# remove the Info.plist path component from the path to info.plist
		plist="${plist%/Info.plist}"
		# append the name of the script to get the absolute path to the script

		# for nodejs-based actions
		# detects only index.js files
		if [ -e "${plist}/Scripts/index.js" ]; then
			script="${plist}/Scripts/index.js"
		else
			script="${plist}/Scripts/${script_name}"
		fi
	fi


	if [[ "${LB_OPTION_COMMAND_KEY}" == "1" ]]; then
		open -R "${script}"
	else
		open "${script}"
	fi
done
