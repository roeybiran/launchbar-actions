#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"; do
	open -a "/System/Library/CoreServices/Applications/Archive Utility.app" "${f}"
done
