#!/bin/sh
#
# LaunchBar Action Script
#

for ARG in "$@"; do
	xattr -w com.dropbox.ignored 1 "$ARG"
done
