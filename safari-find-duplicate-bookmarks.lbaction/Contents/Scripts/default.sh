#!/bin/sh
#
# LaunchBar Action Script
#

output="$(
	plutil -convert xml1 ~/Library/Safari/Bookmarks.plist -o - |
		grep URLString -A 1 |
		grep -Eo '<string>.+</string>' |
		sed -E 's@^<string>|</string>$@@g' |
		sort |
		uniq -d
)"

if [ -z "$output" ]; then
	echo "No Duplicates"
else
	echo "$output"
fi
