#!/bin/bash

osascript -e 'tell application "LaunchBar" to hide'

if [[ -d "${1}" ]]; then
	target_folder="${1}"
	files_requested="$(osascript -e 'set dialog to display dialog "Delimit multiple files with a /" default answer ""' -e 'return text returned of dialog')"
	if [[ -z "${files_requested}" ]]; then
		exit 0
	fi
else
	files_requested="${1}"
	target_folder="$(osascript -e 'tell application "Finder" to return POSIX path of (insertion location as alias)')"
fi

while IFS=$'\n' read -r file; do
	base_name="$(printf "%s\n" "${file}" | sed -E 's|^[[:space:]]+||' | sed -E 's|[[:space:]]+$||')"
	if [[ "${base_name}" != *"."* ]]; then
		extension=".txt"
		name="${base_name}"
	else
		extension=".$(printf "%s\n" "${base_name}" | awk -F "." '{print $NF}')"
		name=$(printf "%s\n" "${base_name}" | sed "s/${extension}//")
	fi
	full_path="${target_folder}/${name}${extension}"
	for ((i = 0; i < 10; i++)); do
		if [[ -f "${full_path}" ]]; then
			n=$((i + 2))
			full_path="${target_folder}/${name} ${n}${extension}"
		else
			break
		fi
	done
	if [[ "${i}" -eq 10 ]]; then
		echo "Deduplication limit reached"
		exit 1
	fi
	full_path=$(printf "%s\n" "${full_path}" | sed 's|//|/|g')
	touch "${full_path}"
	case "${extension}" in
	".sh")
		printf "%s\n" "#!/usr/bin/env sh" >"${full_path}"
		;;
	".py")
		printf "%s\n" "#!/usr/bin/env python" >"${full_path}"
		;;
	".js")
		printf "%s\n" "#!/usr/bin/env node" >"${full_path}"
		;;
	".scpt")
		cp "./template.scpt" "${full_path}"
		;;
	".aep")
		cp "./template.aep" "${full_path}"
		;;
	".workflow") ;;

	esac
	chmod +x "${full_path}"
	if [[ "${LB_OPTION_SHIFT_KEY}" == "1" ]]; then
		# TODO: python script to print json to launchbar
		:
	else
		open "${full_path}" 2>/dev/null
	fi
done < <(printf "%s\n" "${files_requested}" | tr '/' '\n')
