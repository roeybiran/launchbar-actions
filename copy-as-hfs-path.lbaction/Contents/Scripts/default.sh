#!/bin/bash

# /usr/local/bin/node index.js "${@}"

paths=()
for arg in "${@}"; do
	paths+=("$(osascript -e "on run argv" -e "POSIX file (item 1 of argv) as text" -e "end run" "${arg}")")
done
printf "%s\n" "${paths[@]}"
