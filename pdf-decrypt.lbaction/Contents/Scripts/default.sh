#!/bin/bash
# Removes the password from each PDF passed by LaunchBar, saving "<name>_decrypted.pdf" next to it, using PDFKit (no dependencies).
# Runs through osascript because AppleScriptObjC can't load PDFKit inside LaunchBar's own process.

password=$(
	/usr/bin/osascript <<'EOF'
try
	text returned of (display dialog "Enter the password for the PDF" default answer "" with hidden answer)
end try
EOF
)

if [ -z "$password" ]; then
	exit 0
fi

# Password is passed through the environment so it doesn't show up in the process list.
PDF_PASSWORD="$password" exec /usr/bin/osascript - "$@" <<'EOF'
use AppleScript version "2.4"
use framework "Foundation"
use framework "Quartz"
use scripting additions

on run argv
	set pw to (current application's NSProcessInfo's processInfo()'s environment()'s objectForKey:"PDF_PASSWORD") as text
	set outPaths to {}
	repeat with inPath in argv
		set inPath to inPath as text
		set doc to current application's PDFDocument's alloc()'s initWithURL:(current application's NSURL's fileURLWithPath:inPath)
		if doc is missing value then
			tell application "LaunchBar" to display alert "Could not open " & inPath
			return ""
		end if
		if (doc's isLocked()) as boolean then
			if not ((doc's unlockWithPassword:pw) as boolean) then
				tell application "LaunchBar" to display alert "Wrong password for " & inPath
				return ""
			end if
		end if

		set base to inPath
		if base ends with ".pdf" then set base to text 1 thru -5 of base
		set outPath to base & "_decrypted.pdf"
		-- Re-saving the unlocked document would keep its encryption, so copy its pages into a new, unencrypted one.
		set newDoc to current application's PDFDocument's alloc()'s init()
		repeat with i from 0 to ((doc's pageCount()) - 1)
			(newDoc's insertPage:((doc's pageAtIndex:i)'s |copy|()) atIndex:i)
		end repeat
		set attrs to doc's documentAttributes()
		if attrs is not missing value then newDoc's setDocumentAttributes:attrs
		set outlineNode to doc's outlineRoot()
		if outlineNode is not missing value then newDoc's setOutlineRoot:outlineNode
		if not ((newDoc's writeToFile:outPath) as boolean) then
			tell application "LaunchBar" to display alert "Could not write " & outPath
			return ""
		end if
		set end of outPaths to outPath
	end repeat
	set AppleScript's text item delimiters to linefeed
	return outPaths as text
end run
EOF
