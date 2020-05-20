#!/bin/bash

PATH=$PATH:/usr/local/bin

# https://github.com/BlueM/Pashua-Bindings
# https://github.com/BlueM/Pashua
pashua_run() {
	local pashua_configfile
	local pashuapath
	local result
	local name
	local value
	pashua_configfile=$(/usr/bin/mktemp /tmp/pashua_XXXXXXXXX)
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

if [[ ! -d '/Applications/Pashua.app/' ]]; then
	osascript -e 'display notification "This script requires \"Pashua.app\" in order to run"'
	exit 0
elif [[ ! -f /usr/local/bin/pdftk ]]; then
	osascript -e 'display notification "This script requires \"pdftk\" in order to run"'
	exit 0
fi

same_source_dir=true
first_path="$(dirname "${1}")"
for f in "${@}"; do
	dir="$(dirname "${f}")"
	if [[ "${dir}" != "${first_path}" ]]; then
		same_source_dir=false
		break
	fi
done

if "${same_source_dir}"; then
	dest_path="${first_path}"
	rbdefault="Same as originals"
	rbdisabled="0"
else
	rbdisabled="1"
	rbdefault="Other..."
fi

conf="
radiobutton_destination.type = radiobutton
radiobutton_destination.rely = -20
radiobutton_destination.label = Destination:
radiobutton_destination.option = Same as originals
radiobutton_destination.option = Other...
radiobutton_destination.default = ${rbdefault}
radiobutton_destination.disabled = ${rbdisabled}

pathpicker.type = openbrowser
pathpicker.default = ${HOME}/Desktop

_.type = text
_.default = After operation::
_.rely = -20
checkbox_trash.type = checkbox
checkbox_trash.label = Trash originals
checkbox_trash.default = 0
checkbox_trash.rely = -20
checkbox_reveal_in_finder.type = checkbox
checkbox_reveal_in_finder.label = Reveal in Finder
checkbox_reveal_in_finder.rely = -20

# Add a cancel button with default label
cancel_button.type = cancelbutton
_.type = defaultbutton
"

pashua_run "${conf}" /Applications/Pashua.app/Contents/MacOS/Pashua

if [[ "${cancel_button}" == "1" ]]; then
	echo "Cancelled."
	exit 0
fi

if [[ "${radiobutton_destination}" == "Other..." ]]; then
	dest_path="${pathpicker}"
fi

count=$(($# - 1))
targetname="$(basename "${1}" | sed 's/.pdf//') and ${count} others"
dest="${dest_path}/${targetname}.pdf"
open -g "hammerspoon://start-task-with-progress"
/usr/local/bin/pdftk "${@}" cat output "${dest}"
open -g "hammerspoon://stop-task-with-progress"
echo "${dest}" | pbcopy

if [[ "${checkbox_trash}" == "1" ]]; then
	/usr/local/bin/trash "${@}"
fi

if [[ "${checkbox_reveal_in_finder}" == "1" ]]; then
	open -R "${dest}"
fi
