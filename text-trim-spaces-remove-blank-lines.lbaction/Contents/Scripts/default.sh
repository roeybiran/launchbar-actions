#!/bin/bash

transform() {
	printf "%s" "${1}" | sed -E '/^[[:space:]]*$/d' | sed -E 's/[[:space:]]*$//g' | perl -pe 'chomp if eof'
}

tempfile="$(mktemp)"
for arg in "${@}"; do
	if [[ -f "${arg}" ]]; then
		printf "%s" "$(transform "$(cat "${arg}")")" >"${tempfile}" && mv -f "${tempfile}" "${arg}"
	else
		osascript - "$(transform "${arg}")" <<-EOF
			on run argv
				tell app "LaunchBar" to paste in frontmost application (item 1 of argv)
			end run
		EOF
	fi
done
