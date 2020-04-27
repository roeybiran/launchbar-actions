#!/bin/bash
#
# LaunchBar Action Script
#

msgs=$(
	/usr/bin/osascript <<-EOF
		tell application "System Events"
			set mailInFront to frontmost of application process "Mail"
		end tell
		tell application "Mail"
			if mailInFront then
				set messagesContents to {}
				set selectedMessages to selection
				repeat with i from 1 to count selectedMessages
					set theMessage to item i of selectedMessages
					tell theMessage
						set end of messagesContents to content of theMessage
					end tell
				end repeat
			else
				tell account 1
					ignoring case, diacriticals, hyphens, numeric strings, punctuation and white space
						tell (mailbox 1 whose name = "inbox")
							set messagesContents to content of message 1
						end tell
					end ignoring
				end tell
			end if
		end tell
	EOF
)

echo "${msgs}" | sed -E '/^[[:space:]]*$/d' | sed -E '/^[^[:alnum:]]*$/d' | uniq
