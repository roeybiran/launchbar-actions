#!/bin/bash
# Splits each PDF passed by LaunchBar into single pages in "<name>_split/" next to it, using PDFKit (no dependencies).
# Runs through osascript because AppleScriptObjC can't load PDFKit inside LaunchBar's own process.

exec /usr/bin/osascript - "$@" <<'EOF'
use AppleScript version "2.4"
use framework "Foundation"
use framework "Quartz"
use scripting additions

on run argv
	set fm to current application's NSFileManager's defaultManager()
	set outPaths to {}

	repeat with inPath in argv
		set inPath to inPath as text
		set doc to current application's PDFDocument's alloc()'s initWithURL:(current application's NSURL's fileURLWithPath:inPath)
		if doc is missing value then
			tell application "LaunchBar" to display alert "Could not open " & inPath
			return ""
		end if

		set base to inPath
		if base ends with ".pdf" then set base to text 1 thru -5 of base
		set outDir to base & "_split"
		set n to 2
		repeat while (fm's fileExistsAtPath:outDir) as boolean
			set outDir to base & "_split " & n
			set n to n + 1
		end repeat
		fm's createDirectoryAtPath:outDir withIntermediateDirectories:true attributes:(missing value) |error|:(missing value)

		set baseName to (current application's NSString's stringWithString:base)'s lastPathComponent() as text
		set pageCount to doc's pageCount() as integer
		repeat with i from 1 to pageCount
			set pageDoc to current application's PDFDocument's alloc()'s init()
			(pageDoc's insertPage:((doc's pageAtIndex:(i - 1))'s |copy|()) atIndex:0)
			set outPath to outDir & "/" & baseName & "_" & i & ".pdf"
			if not ((pageDoc's writeToFile:outPath) as boolean) then
				tell application "LaunchBar" to display alert "Could not write " & outPath
				return ""
			end if
			set end of outPaths to outPath
		end repeat
	end repeat

	set AppleScript's text item delimiters to linefeed
	return outPaths as text
end run
EOF
