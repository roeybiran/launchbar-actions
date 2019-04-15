#!/bin/bash

path=$(osascript <<-EOF
tell application "Finder"
	set thePath to target of Finder window visible as alias
	set thePath to POSIX path of thePath
end tell
EOF
)

cp "${HOME}/Dropbox/dotfiles/symlinks/Applications/Script Debugger.app/Contents/Library/Templates/AppleScript/AppleScript/AppleScript.sdtemplate/Empty Script.scpt" "${path}/Untitled.scpt"
open "${path}/Untitled.scpt"