#!/bin/sh
#
# LaunchBar Action Script
#

blueutil=/usr/local/bin/blueutil
if ! test -e "$blueutil"; then
	osascript -e 'tell app "LaunchBar" to display alert "This action requires blueutil to run."'
	exit
fi

if test "$("$blueutil" -p)" = "1"; then
	"$blueutil" -p 0
else
	"$blueutil" -p 1
fi
