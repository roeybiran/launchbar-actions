#!/bin/bash
#
# LaunchBar Action Script
#

# https://flexibits.com/fantastical/help/integration-with-other-apps

if [[ "${LB_OPTION_SHIFT_KEY}" == "1" ]]
then
	arg="calendar"
else
	arg="mini"
fi
/usr/bin/open "x-fantastical2://show/${arg}"
