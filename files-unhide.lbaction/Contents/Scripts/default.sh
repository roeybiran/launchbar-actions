#!/bin/sh
#
# LaunchBar Action Script
#

for f in "${@}"
do
    /usr/bin/chflags nohidden "${f}"
done
