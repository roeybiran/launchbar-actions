#!/bin/sh
#
# LaunchBar Action Script
#

for pid in $(pgrep WhatsApp); do
	kill -9 "${pid}"
done

open -a "WhatsApp"
