#!/bin/sh
#
# LaunchBar Action Script
#

for f in "$@"; do
    /usr/bin/sips --flip vertical "${f}"
done
