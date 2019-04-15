#!/bin/bash

for f in "${@}"; do

parent_folder=$(dirname "${f}")
file_name=$(basename "${f}")
file_ext="${file_name##*.}"
file_name="${file_name%.*}"

	/usr/local/bin/magick convert "${f}" -background white -gravity center -resize 550x550 -extent 640x640 "${parent_folder}/${file_name}.IG.${file_ext}"
	/usr/local/bin/exiftool -overwrite_original -all= "${parent_folder}/${file_name}.IG.${file_ext}"

done
