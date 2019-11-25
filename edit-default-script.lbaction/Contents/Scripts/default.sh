#!/bin/bash
#
# LaunchBar Action Script
#

# requires ripgrep

if ! [[ -e /usr/local/bin/rg ]]
then
	exit 1
fi

for f in "${@}"; do
	# if an .lbaction is sent
	if ! [[ -d "${f}" ]]; then
	 	# if the action object itself is sent, search for its name
		plist="$(/usr/local/bin/rg -l -g "Info.plist" "<string>${f}</string>" "$HOME/Library/Application Support/LaunchBar/Actions/")"
	else
		plist="${f}/Contents/Info.plist"
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

	if [[ "${LB_OPTION_COMMAND_KEY}" -eq 1 ]]; then
		open -R "${script}"
	else
		open "${script}"
	fi
done
