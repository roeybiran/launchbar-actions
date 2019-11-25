#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"; do
    chmod +x "${f}"
    if [ $? -ne 0 ]; then
		afplay /System/Library/Sounds/Basso.aiff
		exit 1
	fi
done
afplay /System/Library/Sounds/Hero.aiff