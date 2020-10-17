#!/bin/bash
#
# LaunchBar Action Script
#

name="New Text Document"
dir="$(osascript -e 'tell app "Finder" to POSIX path of (insertion location as alias)')"
path="${dir}/${name}.txt"
i=2
while test -f "${path}"; do
	path="${dir}/${name} ${i}.txt"
	((i++))
done

text="${1}"

touch "${path}" && printf "%s" "${text}" >"${path}"
