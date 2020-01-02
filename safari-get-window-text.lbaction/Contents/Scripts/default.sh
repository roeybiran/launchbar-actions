#!/bin/sh

text=$(/usr/bin/osascript <<-EOF
	tell application "Safari"
		tell window 1
			tell (tab 1 whose visible = true)
				return its text
			end tell
		end tell
	end tell
EOF
)

/usr/bin/printf "%s\n" "${text}" | sed -E '/^[[:space:]]*$/d'
