#!/bin/bash
#
# LaunchBar Action Script
#

arr=()
while IFS=$'\n' read -r LINE; do
	arr+=("$(printf "%s:%s" "$(stat -f "%B" "${LINE}")" "${LINE}")")
done < <(find -E "/Users/roey/Pictures/Photos Library.photoslibrary" -type f -iregex "^.+\.(jpeg|png|jpg|raw)$" -newerBt '14 days ago')

printf "%s\n" "${arr[@]}" | sort -r | sed -E 's/^[[:digit:]]+://g'
