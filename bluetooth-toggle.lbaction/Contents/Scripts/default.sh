#!/bin/sh
#
# LaunchBar Action Script
#

test "$(/usr/local/bin/blueutil -p)" = "1" && /usr/local/bin/blueutil -p 0 && exit

/usr/local/bin/blueutil -p 1
