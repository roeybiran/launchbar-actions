#!/bin/sh
#
# LaunchBar Action Script
#

for f in "$@"; do
	/usr/bin/sips --rotate "-90" "${f}"
done
