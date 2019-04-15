#!/bin/sh
#
# LaunchBar Action Script
#

error_log=$(mktemp /tmp/${0##*/}XXXXXX)

for f in "${@}"; do
	xattr -d com.apple.quarantine "${f}" 2>>"${error_log}"; then
    if [ $? -ne 0 ]; then
		afplay /System/Library/Sounds/Basso.aiff
		exit 1
	fi
done
afplay /System/Library/Sounds/Hero.aiff