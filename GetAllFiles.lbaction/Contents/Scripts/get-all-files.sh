#!/bin/sh
#
# LaunchBar Action Script
#

# If a folder with the same name already exists, append a number
# takes 2 args: the file to rename
# the target folder
renamer () {
	num=2
	while [[ -d "${target_folder} ${num}" ]]; do
		(( num++ ))
	done
	echo "${target_folder} ${num}"
}

f () {
# Destination folder's path and name: the first folder sent as an argument

directory=$(dirname "${1}")
foldername=$(basename "${1}")

# Set a name for the new folder based on the number of arguments
if [ $# -eq 1 ]; then
	target_folder="${directory}/files of ${foldername}"
else
	num_of_additional_folders=$(( $#-1 ))
	target_folder="${directory}/files of ${foldername} and ${num_of_additional_folders} others"
fi

if [[ ! -d "${target_folder}" ]]; then
	mkdir "${target_folder}"
else
	newname=$(renamer "${target_folder}")
	mkdir "${newname}"
fi

for folder in "${@}"; do
	_mdfind=$(mdfind -onlyin "${folder}" "kMDItemContentType != 'public.folder'")
	_find=$(find "${folder}" -name ".*" -not -name ".DS_Store")
done

files="${_mdfind}${_find}"

# echo "${files}"
files_arr=()

while IFS= read -r line; do
	# echo "${line}"
	files_arr+=("${line}")
done <<< "${files}"

for (( i = 0; i < "${#files_arr[@]}"; i++ )); do
	echo "${files_arr[$i]} -- ${files_arr[$i+1]}"
done

}

f "${HOME}/Desktop/tests"


# for folder in "${@}"; do
# 	# Find & copy every file in every folder sent as an argument
# 	# first expression: find every macOS psuedo-folder (we'll treat it as a file, and not descend into it), or every file that isn't a 'dotfile'
# 	# second expression: each of the above must not be nested inside any of the macOS psuedo-folder
# 	files_found=$(find -E "${folder}" \( -type d -iregex '.*(\.app|\.pkg|\.framework|\.plugin|\.bundle)$' -o -type f -not -iname ".*" \) -not \( -iregex '.*(\.app/|\.pkg/|\.framework/|\.plugin/|\.bundle/).*' \))
# 	# files_found=$(find "${folder}" \( -type f \! -ipath "*.app*" \) -o \( -type d -ipath "*.app" \! -ipath "*.app*.app" \))

# 	while IFS= read -r file; do
# 		file_name_ext=$(basename "${file}")
# 		file_name="${file_name_ext%.*}"
# 		file_extensions="${file_name_ext##*.}"

# 		# conflicting filenames are handled via a renaming mechanism
# 		if [[ ! -e "${target_folder}/${file_name_ext}" ]]; then
# 			cp -i -R "${file}" "${target_folder}"
# 		else
# 			num=2
# 			while [[ -e "${target_folder}/${file_name} ${num}.${file_extensions}" ]]; do
# 				(( num++ ))
# 			done
# 			cp -i -R "${file}" "${target_folder}/${file_name} ${num}.${file_extensions}"
# 		fi

# 		done <<<"${files_found}"
# done

# afplay /System/Library/Sounds/Hero.aiff

