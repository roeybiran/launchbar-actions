#!/bin/bash

# for f in "${@}"; do

	mode="${1}"
	parent_folder=$(dirname "${2}")
	file_name=$(basename "${2}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	if [[ "${mode}" == "--copy" ]]; then
		/usr/local/bin/convert "${2}" -trim +repage "${parent_folder}/${file_name}-TRIMMED.${file_ext}"
		else
		/usr/local/bin/convert "${2}" -trim +repage "${parent_folder}/${file_name}-TRIMMED.${file_ext}"
		mv "${2}" ~/.Trash
	fi

# done
