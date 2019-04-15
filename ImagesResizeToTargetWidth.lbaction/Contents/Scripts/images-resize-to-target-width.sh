#!/bin/bash

target_width=$(osascript <<-END
	set theResponse to display dialog "Enter target width, in pixels" default answer "" buttons {"Cancel", "Continue"} default button "Continue"
	set theWidth to text returned of theResponse as integer
	return theWidth
	END
	)

for f in "${@}"; do

	parent_folder=$(dirname "${f}")
	file_name=$(basename "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	sips --resampleWidth "${target_width}" "${f}" --out "${parent_folder}/${file_name}-RESIZED.${file_ext}"
	
done
