#!/bin/sh

osascript - "$1" <<'EOF'
on run argv
	if (count of argv) = 0 or item 1 of argv is "" then
		set theText to the clipboard as text
	else
		set theText to item 1 of argv
	end if
	tell application "System Events" to keystroke theText
end run
EOF
