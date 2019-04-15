#!/bin/bash

current_date=$(date '+%Y_%M_%d_%H_%M_%S')

click_annotation_thumbnail () {
	sleep 0.3
	xy=$(osascript <<-EOF
	tell application "Finder"
	  get bounds of window of desktop
	  set _b to bounds of window of desktop
	  set _width to item 3 of _b
	  set _height to item 4 of _b
	  set theX to _width - 30
	  set theY to _height - 30
	end tell
	return theX & "," & theY as text
	EOF
	)
	/usr/local/bin/cliclick -r c:"${xy}"
}

click_on_options () {
	sleep 0.3
	osascript - "${1}" <<-EOF &
	on run { theButton }
		tell application "System Events"
			tell process "screencaptureui"
				tell window 1
					click checkbox theButton
				end tell
			end tell
		end tell
	end run
	EOF
}

case "${1}" in
	--capture-selection-to-clipboard)
		screencapture -ci
		;;
	--capture-selection-to-desktop-annotation)
		click_on_options "Capture Selected Portion"
		screencapture -iUu "${HOME}/Desktop/screencapture_${current_date}.png"
		click_annotation_thumbnail
		;;
	--capture-screen-to-desktop-annotation)
		click_on_options "Capture Entire Screen"
		screencapture -iUu "${HOME}/Desktop/screencapture_${current_date}.png"
		click_annotation_thumbnail
		;;
	--capture-screen-to-desktop)
		screencapture -S "${HOME}/Desktop/screencapture_${current_date}.png"
		;;
	--capture-selection-to-preview) screencapture -iP;;
	--capture-selection-to-desktop) screencapture -i "${HOME}/Desktop/screencapture_${current_date}.png";;
	--record-screen-to-desktop-annotation)
	click_on_options "Record Entire Screen"
	screencapture -iUu "${HOME}/Desktop/screencapture_${current_date}.png"
	click_annotation_thumbnail;;
	--record-selection-to-desktop-annotation)
	click_on_options "Record Selected Portion"
	screencapture -iUu "${HOME}/Desktop/screencapture_${current_date}.png"
	click_annotation_thumbnail;;
	*) exit 1
esac
