#!/bin/bash

pashua_run() {
	local pashua_configfile
	local pashuapath
	local result
	local name
	local value
	pashua_configfile=$(mktemp /tmp/pashua_XXXXXXXXX)
	# Write config file
	echo "$1" >"$pashua_configfile"
	pashuapath="${2}"
	# Get result
	result=$("$pashuapath" "$pashua_configfile")
	# Remove config file
	rm "$pashua_configfile"
	# Parse result
	while IFS=$'\n' read -r line; do
		name=$(echo $line | sed 's/^\([^=]*\)=.*$/\1/')
		value=$(echo $line | sed 's/^[^=]*=\(.*\)$/\1/')
		eval "$name"='$value'
	done <<<"${result}"
}

alert() {
	osascript -e "display alert \"Error\" message \"${1}\" as critical"
}

if [[ ! -d '/Applications/Pashua.app/' ]]; then
	alert 'display notification "This script requires \"Pashua.app\" in order to run"'
	exit
fi

# set -x

mode="${1}"
shift

if [[ "${mode}" == --unarchive ]]; then
	window_title="Unarchive to..."
	checkbox_compress_individually="#"
elif [[ "${mode}" == --archive ]]; then
	window_title="Archive to..."
	checkbox_compress_individually="checkbox_compress_individually"
else
	echo "Invalid first argument: has to be '--archive' or '--unarchive'"
	exit
fi

same_source_dir=true
first_path="$(dirname "${1}")"
if [[ -z "${first_path}" ]]; then
	echo "Specify at least 1 path."
	exit
fi
for f in "${@}"; do
	dir="$(dirname "${f}")"
	if [[ "${dir}" != "${first_path}" ]]; then
		same_source_dir=false
		break
	fi
done

if "${same_source_dir}"; then
	dest_path="${first_path}"
	radio_button_destination_default_value="Same as originals (${first_path})"
	radio_button_is_disabled="0"
else
	radio_button_destination_default_value="Other..."
	radio_button_is_disabled="1"
fi

conf="
*.title = ${window_title}
radiobutton_destination.type = radiobutton
radiobutton_destination.rely = -20
radiobutton_destination.label = Destination:
radiobutton_destination.option = ${radio_button_destination_default_value}
radiobutton_destination.option = Other...
radiobutton_destination.default = ${radio_button_destination_default_value}
radiobutton_destination.disabled = ${radio_button_is_disabled}

pathpicker.type = openbrowser
pathpicker.default = ${HOME}/Desktop

after_done_options_label.type = text
after_done_options_label.text = When done:
after_done_options_label.rely = -20
checkbox_trash.type = checkbox
checkbox_trash.label = Trash originals
checkbox_trash.default = 1
checkbox_trash.rely = -20
checkbox_reveal_in_finder.type = checkbox
checkbox_reveal_in_finder.label = Reveal in Finder
checkbox_reveal_in_finder.rely = -20
${checkbox_compress_individually}.type = checkbox
${checkbox_compress_individually}.label = Compress Individually

# Add a cancel button with default label
cancel_button.type = cancelbutton
ok_button.type = defaultbutton
"

pashua_run "${conf}" /Applications/Pashua.app/Contents/MacOS/Pashua

if [[ "${cancel_button}" == "1" ]]; then
	echo "Cancelled."
	exit 0
fi

if [[ "${radiobutton_destination}" == "Other..." ]]; then
	dest_path="${pathpicker}"
fi

open -g "hammerspoon://start-task-with-progress"

seen_names=()
if [[ "${mode}" == --archive ]]; then
	if [[ "${checkbox_compress_individually}" == "1" ]]; then
		dest_path="${dest_path}/$(basename "${f}").zip"
		for f in "${@}"; do
			ditto -c -k --sequesterRsrc "${f}" "${dest_path}"
			echo "${dest_path}" | pbcopy
		done
	else
		dest_path="${dest_path}/Archive.zip"
		if [[ -f "${dest_path}" ]]; then
			alert "Archive.zip already exists at target path."
			exit
		fi
		for f in "${@}"; do
			cd "$(dirname "${f}")" || exit
			filename="$(basename "${f}")"
			for seen_name in "${seen_names[@]}"; do
				if [[ "${seen_name}" == "${filename}" ]]; then
					alert "Cannot add duplicated file name ”${filename}” to archive."
					rm "${dest_path}"
					exit
				fi
			done
			seen_names+=("${filename}")
			# can't archive multiple sources: ditto -c -k --sequesterRsrc "${@}" "${dest_path}/Archive.zip"
			zip -r -X "${dest_path}" "${filename}"
			echo "${dest_path}" | pbcopy
		done
	fi
elif [[ "${mode}" == --unarchive ]]; then
	for f in "${@}"; do
		ditto -xk "${f}" "${dest_path}"
		echo "${dest_path}" | pbcopy
	done
fi

if [[ "${checkbox_trash}" == "1" ]]; then
	/usr/local/bin/trash "${@}"
fi

open -g "hammerspoon://stop-task-with-progress"
