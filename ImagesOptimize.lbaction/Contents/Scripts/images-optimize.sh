#!/bin/bash

for f in "${@}"; do

	parent_folder=$(dirname "${f}")
	file_name=$(basename "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	target_f="${parent_folder}/${file_name}-OPTIMIZED.${file_ext}"

	cp "${f}" "${target_f}"

	/usr/local/bin/pngquant "${target_f}"
	/usr/local/bin/advpng -z "${target_f}"
	/usr/local/bin/imageoptim "${target_f}"

done
