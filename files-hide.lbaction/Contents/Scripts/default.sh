#!/bin/sh
#
# LaunchBar Action Script
#

# Set "hidden" flag on every file passed:
for f in "${@}"
do
    /usr/bin/chflags hidden "${f}"
done
