#!/bin/bash

### BEGIN error logging ###

errchk  () {

if [[ ! -z "${1}" ]]; then
	echo "${1}" > "${errorlog}"
fi

if [ -s "${errorlog}" ]; then
	afplay /System/Library/Sounds/Basso.aiff
	errormessage=$(cat "${errorlog}")
	error_alert=$(osascript - "${errormessage}" <<-EOF
		on run { errorMessage }
			display dialog errorMessage buttons {"Show Log", "OK"} default button "OK" -- cancel button "Cancel"
			return button returned of result
		end run
	EOF
	)
	if [ "${error_alert}" == "Show Log" ]; then
		open "${errorlog}"
	fi
	# to avoid an additional launchbar alert
	exit 0
fi

}

logname=${0##*/}
errorlog=$(mktemp /tmp/${logname}.xxxxxx)
mv "${errorlog}" "${errorlog}.log"
errorlog="${errorlog}.log"

### END error logging ###

limit=$(echo "${1}" | cut -s -d':' -f1 )
keyword=$(echo "${1}" | cut -s -d':' -f2 )

if [[ -z "${limit}" ]] || [[ -z "${keyword}" ]]; then
	errchk "Provide at least two arguments (limit, keyword), separated with a colon. Example: 2:cats."
fi

osascript - "${limit}" "${keyword}" <<-EOF
	on run { _limit, _keyword }
		tell application "LaunchBar" to display in notification center "downloading " & _limit & " images of " & _keyword
	end run
EOF

~/Library/Python/2.7/bin/googleimagesdownload -n -o ~/Downloads -k "${keyword}" -l "${limit}" 2>"${errorlog}"

if [[ $? -ne 0 ]]; then
	errchk
fi

open -R ~/Downloads/*
afplay /System/Library/Sounds/Hero.aiff
osasscript -e 'tell application "LaunchBar" to display in notification center "Done!"'
exit 0