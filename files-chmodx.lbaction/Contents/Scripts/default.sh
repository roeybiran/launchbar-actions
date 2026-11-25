#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"; do
	if ! chmod +x "${f}"; then
		afplay /System/Library/Sounds/Basso.aiff
		exit 1
	fi
done
afplay /System/Library/Sounds/Hero.aiff
