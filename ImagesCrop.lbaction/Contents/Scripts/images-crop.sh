#!/bin/bash

for f in "${@}"; do

	parent_folder=$(dirname "${f}")
	file_name=$(basename "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	DD=$(/usr/local/bin/identify -format "%[fx:min(w,h)]" "${f}")

	/usr/local/bin/convert "${f}" -gravity center -crop ${DD}x${DD}+0+0 +repage "${parent_folder}/${file_name}-CROPPED.${file_ext}"
done
