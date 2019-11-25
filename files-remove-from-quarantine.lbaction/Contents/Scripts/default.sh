#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"; do
	/usr/bin/xattr -d com.apple.quarantine "${f}" 1>/dev/null 2>&1
done
exit 0
