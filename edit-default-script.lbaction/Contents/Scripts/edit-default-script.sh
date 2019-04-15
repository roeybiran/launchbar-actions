#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"; do
	if [[ -d "${f}" ]]; then # if an .lbaction is sent
		plist="${f}/Contents/Info.plist"
		script=$(/usr/libexec/PlistBuddy -c "Print :LBScripts:LBDefaultScript:LBScriptName" "${plist}")
		script="${f}/Scripts/${script}"
	else # if the action itself is sent
		for p in ~/Library/Application\ Support/LaunchBar/Actions/*/Contents/Info.plist; do
			action_name=$(/usr/libexec/PlistBuddy -c "Print :CFBundleName" "${p}") # get the action's display name from its plist
			if [[ "${action_name}" == "${f}" ]]; then
				script=$(/usr/libexec/PlistBuddy -c "Print :LBScripts:LBDefaultScript:LBScriptName" "${p}")
				# remove the Info.plist path component
				p="${p/Info.plist/}"
				script="${p}/Scripts/${script}"
				break
			fi
		done
	fi
	if [[ "${LB_OPTION_COMMAND_KEY}" -eq 1 ]]; then
		open -R "${script}"
	else
		open "${script}"
	fi
done
