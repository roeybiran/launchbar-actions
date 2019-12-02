#!/bin/bash
#
# LaunchBar Action Script
#

if [[ "${LB_OPTION_SHIFT_KEY}" == "1" ]]
then
	/usr/bin/open "x-fantastical2://show/calendar"
else
	/usr/bin/open "x-fantastical2://show/mini"
fi
