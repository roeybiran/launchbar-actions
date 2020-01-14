#!/bin/bash
#
# LaunchBar Action Script
#

msgs=$(
	/usr/bin/osascript <<-EOF
		set messagesContents to {}
		tell application "Mail"
				set selectedMessages to selection
				repeat with i from 1 to count selectedMessages
					set theMessage to item i of selectedMessages
					tell theMessage
						set end of messagesContents to content of theMessage
					end tell
				end repeat
		end tell
		return messagesContents as text
	EOF
)

while IFS=$'\n' read -r line; do
	echo "${line}"
done < <(echo "${msgs}" | sed -E '/^[[:space:]]*$/d' | uniq)
