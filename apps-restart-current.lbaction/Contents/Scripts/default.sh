#!/bin/sh
#
# LaunchBar Action Script
#

osascript << 'EOF'
tell application "System Events"
	set theProcess to process 1 whose frontmost of it is true
	set bundleID to bundle identifier of theProcess
	set pid to unix id of theProcess
end tell

try
	with timeout of 1 second
		tell application id bundleID to quit
	end timeout
on error
	do shell script "kill -15 " & pid
end try

delay 2

tell application id bundleID to activate
EOF


