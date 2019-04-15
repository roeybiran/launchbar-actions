#!/bin/bash

for f in "${@}"; do

	parent_folder=$(dirname "${f}")
	file_name=$(basename "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	sips -s format pdf "${f}" --out "${parent_folder}/${file_name}.pdf"

done
