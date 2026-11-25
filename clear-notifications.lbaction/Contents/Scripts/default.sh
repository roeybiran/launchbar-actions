#!/bin/sh

osascript <<'APPLESCRIPT'
tell application "System Events" to tell application process "NotificationCenter"
	set dismissActions to {}
	repeat with notificationWindow in windows
		set notificationElements to entire contents of notificationWindow
		repeat with notificationElement in notificationElements
			try
				if role of notificationElement is "AXGroup" then
					set notificationActions to actions of notificationElement
					repeat with notificationAction in notificationActions
						set actionName to name of notificationAction
						if actionName starts with "Name:Clear All" or actionName starts with "Name:Close" then
							set end of dismissActions to contents of notificationAction
							exit repeat
						end if
					end repeat
				end if
			on error errorMessage number errorNumber
				log ("Could not inspect notification: " & errorMessage & " (" & errorNumber & ")")
			end try
		end repeat
	end repeat

	-- Dismissing a banner changes the accessibility tree, so work backwards.
	repeat with actionIndex from (count of dismissActions) to 1 by -1
		try
			perform item actionIndex of dismissActions
		on error errorMessage number errorNumber
			log ("Could not dismiss notification: " & errorMessage & " (" & errorNumber & ")")
		end try
	end repeat
end tell
APPLESCRIPT
