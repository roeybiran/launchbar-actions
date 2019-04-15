#!/bin/sh
#
# LaunchBar Action Script
#


_input=$(osascript <<-EOF
	on run
		set theResponse to display dialog "Usage: WxH (pixels)..." default answer "" with icon note buttons {"Cancel", "Continue"} default button "Continue" cancel button "Cancel"
		set theInput to text returned of theResponse
	end run
EOF
)

input_width=$(cut -d'x' -f1 <<< "${_input}")
input_height=$(cut -d'x' -f2 <<< "${_input}")

for f in "$@"; do

	if [[ "${input_width}" -gt "${input_height}" ]]; then
		sips --resampleHeightWidthMax "${input_width}" "${f}"
	else
		sips --resampleHeightWidthMax "${input_height}" "${f}"
	fi

	# image_width=$(sips --getProperty pixelHeight "${f}"); image_width="${image_width##* }"
		
	# if [[ "${image_width}" -gt "${input_width}" ]]; then
	#  	sips --resampleWidth "${input_width}" "${f}"
	# fi

	# image_height=$(sips --getProperty pixelWidth "${f}"); image_height="${image_height##* }"
	
	# if [[ "${image_height}" -gt "${input_height}" ]]; then
	#  	sips --resampleHeight "${input_height}" "${f}"
	# fi

	sips --padToHeightWidth "${input_height}" "${input_width}" --padColor FFFFFF "${f}"
done

afplay /System/Library/Sounds/Hero.aiff