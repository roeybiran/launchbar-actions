#!/bin/bash

log_name=${0##*/}

errorlog=$(mktemp /tmp/${logname}.XXXXXX)
mv "${errorlog}" "${errorlog}.log"
errorlog="${errorlog}.log"

for f in "${@}"; do

	parent_dir=$(dirname "${f}")
	file_name=$(basename "${f}"); file_name="${file_name%.*}"
	/usr/local/bin/handbrakecli --preset "Fast 1080p30" -i "${f}" -o "${parent_dir}/${file_name}.Fast1080p30.mp4"
	touch -r "${f}" "${parent_dir}/${file_name}".Fast1080p30.mp4

done

if [ -s "${errorlog}" ] ; then
	error_message=$(cat "${errorlog}")

	error_alert=$(osascript - "${error_message}" << EOF
	on run { errorMessage }
		display dialog errorMessage buttons {"Show Log", "OK"} default button "OK"
		return button returned of result
	end run
EOF
)
	if [ "${error_alert}" == "Show Log" ]; then
		open "${errorlog}"
	fi
fi	