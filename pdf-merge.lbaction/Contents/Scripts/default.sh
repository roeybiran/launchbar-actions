#!/bin/bash
# Merges the PDFs passed by LaunchBar into "<first file>_merged.pdf" using PDFKit (no dependencies).
# Runs through osascript because AppleScriptObjC can't load PDFKit inside LaunchBar's own process.

exec /usr/bin/osascript - "$@" <<'EOF'
use AppleScript version "2.4"
use framework "Foundation"
use framework "Quartz"
use scripting additions

on run argv
	if (count of argv) < 2 then
		tell application "LaunchBar" to display alert "Select at least two PDFs to merge."
		return ""
	end if

	set merged to current application's PDFDocument's alloc()'s init()
	repeat with inPath in argv
		set inPath to inPath as text
		set doc to current application's PDFDocument's alloc()'s initWithURL:(current application's NSURL's fileURLWithPath:inPath)
		if doc is missing value then
			tell application "LaunchBar" to display alert "Could not open " & inPath
			return ""
		end if
		repeat with i from 0 to ((doc's pageCount()) - 1)
			(merged's insertPage:((doc's pageAtIndex:i)'s |copy|()) atIndex:(merged's pageCount()))
		end repeat
	end repeat

	set base to item 1 of argv
	if base ends with ".pdf" then set base to text 1 thru -5 of base
	set outPath to base & "_merged.pdf"
	set n to 2
	set fm to current application's NSFileManager's defaultManager()
	repeat while (fm's fileExistsAtPath:outPath) as boolean
		set outPath to base & "_merged " & n & ".pdf"
		set n to n + 1
	end repeat

	if not ((merged's writeToFile:outPath) as boolean) then
		tell application "LaunchBar" to display alert "Could not write " & outPath
		return ""
	end if
	return outPath
end run
EOF
