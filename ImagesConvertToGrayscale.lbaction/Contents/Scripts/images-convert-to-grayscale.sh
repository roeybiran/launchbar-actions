#!/bin/bash

for f in "${@}"; do

	parent_folder=$(dirname "${f}")
	file_name=$(basename "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	/usr/local/bin/convert "${f}" -type Grayscale "${parent_folder}/${file_name}-GRAYSCALE.${file_ext}"

done

afplay /System/Library/Sounds/Hero.aiff