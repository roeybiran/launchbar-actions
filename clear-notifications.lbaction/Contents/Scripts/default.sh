#!/bin/sh

osascript <<'EOF'
on run
	try
		tell application "System Events" to tell application process "Notification Center" to tell window 1 to tell group 1 to tell group 1 to tell scroll area 1 to tell group 1
			set j to (count of groups)
			if (count of groups) > 0 then
				repeat while j ≥ 0
					set theItem to (item j of groups)
					tell theItem
						repeat with i from 0 to count of actions
							set theAction to item i of actions
							set theName to name of theAction
							if theName contains "Clear All" or theName contains "Close" then
								set theAction to (item i of actions)
								try
									perform action i
								on error msg
									log msg
								end try
							end if
						end repeat
					end tell
					set j to j - 1
				end repeat
			else
				repeat with i from 0 to count of actions
					set theAction to item i of actions
					set theName to name of theAction
					if theName contains "Clear All" or theName contains "Close" then
						set theAction to (item i of actions)
						try
							perform action i
						on error msg
							log msg
						end try
					end if
				end repeat
			end if
		end tell
	end try
end run
EOF