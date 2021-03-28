#!/bin/bash

# http://blog.clawpaws.net/post/2007/02/11/Making-OS-X-Fat-Binaries-with-Traditional-Tools
# https://hacksformacs.wordpress.com/2015/01/12/spotlight-on-the-command-line-part-1-introducing-mdfind-and-xargs/
# https://hacksformacs.wordpress.com/2015/01/28/spotlight-on-the-command-line-part-2-improving-searches/

if test "$LB_OPTION_SHIFT_KEY" = "1"; then
	osascript <<-EOF
		tell application "LaunchBar" to hide
		tell application "Finder"
		        activate
		        if name of first Finder window is "Recents" then
		          return
		        else
		          set winList to every Finder window
		          repeat with aWindow in winList
		            tell aWindow
		              if name = "Recents" and URL of target = "" then
		                set index of aWindow to 1
		                return
		              end if
		            end tell
		          end repeat
		        end if
		      end tell
		      tell application "System Events"
		        tell process "Finder"
		          set frontmost to true
		          keystroke "f" using {shift down, command down}
		        end tell
		    end tell
	EOF
	exit
fi

test -n "${1}" && args=("-onlyin" "${1}")

mdfind "${args[@]}" '((!(_kMDItemGroupId = 8)) && InRange(kMDItemLastUsedDate,$time.today(-3d),$time.today(+1d)))'
