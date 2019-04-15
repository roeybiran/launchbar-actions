#!/bin/sh
#
# LaunchBar Action Script
#

/usr/bin/qlmanage -r && /usr/bin/qlmanage -r cache && afplay /System/Library/Sounds/Hero.aiff

if [[ $? -ne 0 ]]; then
	afplay /System/Library/Sounds/Basso.aiff
	exit 1
else
	exit 0
fi
