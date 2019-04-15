#!/bin/bash

for f in "${@}"; do

	file_name=$(basename "${f}");

	n=$(osascript - "${file_name}" <<-EOF
		on run { fileName }
			set theResponse to display dialog "How many times should \"" & fileName & "\" be duplicated?" default answer "" with icon note buttons {"Cancel", "Continue"} default button "Continue" cancel button "Cancel"
			set n to text returned of theResponse
			set n to n as integer
			return n
		end run
	EOF
	)
	
	# total="${1}"
	# shift
	

	file_dir=$(dirname "${f}")
	file_ext="${file_name##*.}"
	file_name="${file_name%.*}"

	cd "${file_dir}"
	
	for ((i = 2 ; i < "${n}"+2 ; i++)); do
		if [[ ! -d "${f}" ]]; then
			
			
			
			if [[ ! -e "${file_name} ${i}.${file_ext}" ]]; then
				cp "${f}" "${file_name} ${i}.${file_ext}"
			else
				num=2
				while [[ -e "${file_name} ${i} ${num}.${file_ext}" ]]; do
					(( num++ ))
				done
				cp "${f}" "${file_name} ${i} ${num}.${file_ext}"
			fi
		else
			if [[ ! -e "${file_name} ${i}" ]]; then
				cp -r "${f}" "${file_name} ${i}"
			else
				num=2
				while [[ -e "${file_name} ${i} ${num}" ]]; do
					(( num++ ))
				done
				cp -r "${f}" "${file_name} ${i} ${num}"
			fi
		fi
	done
done

