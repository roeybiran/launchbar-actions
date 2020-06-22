#!/bin/bash

BASE_CONF="
radiobutton_destination.type = radiobutton
radiobutton_destination.rely = -20
radiobutton_destination.label = Destination:
radiobutton_destination.option = Next to originals
radiobutton_destination.option = Other...
radiobutton_destination.default = Next to originals

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

_.type = text
_.text =

# Add a cancel button with default label
cancel_button.type = cancelbutton
ok_button.type = defaultbutton
"

alert() {
	osascript -e 'on run argv' -e 'display alert "Error" message (item 1 of argv) as critical' -e 'end run' "${1}"
}

pashua_run() {
	PASHUA_PATH=/Applications/Pashua.app/Contents/MacOS/Pashua

	if [[ ! -f "${PASHUA_PATH}" ]]; then
		alert 'This script requires "Pashua" in order to run'
		exit
	fi

	EXTRA_CONF="${1}"

	pashua_configfile=$(mktemp /tmp/pashua_XXXXXXXXX)
	# Write config file
	printf "%s\n" "${BASE_CONF}" "${EXTRA_CONF}" >"$pashua_configfile"
	# Get result
	result=$("${PASHUA_PATH}" "$pashua_configfile")
	# Remove config file
	rm "$pashua_configfile"
	# Parse result

	while IFS=$'\n' read -r line; do
		name=$(echo $line | sed 's/^\([^=]*\)=.*$/\1/')
		value=$(echo $line | sed 's/^[^=]*=\(.*\)$/\1/')
		eval "$name"='$value'
	done <<<"${result}"

	if [[ "${cancel_button}" == "1" ]]; then
		echo "Cancelled."
		exit 0
	fi
}
