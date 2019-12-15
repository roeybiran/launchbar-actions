#!/bin/sh
#
# LaunchBar Action Script
#

for f in "$@"; do
	/usr/bin/sips --rotate "180" "${f}"
done
