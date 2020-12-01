#!/bin/sh

# https://apple.stackexchange.com/questions/210716/applescript-automatically-check-and-remount-server-volume-stopped-working

test -z "${1}" && exit 0

SERVER_PATH="afp://${1}.local/archive"
mounted_path="/Volumes/$(basename "${SERVER_PATH}")"

if ! [ -d "${mounted_path}" ]; then
	open "${SERVER_PATH}"
	osascript -e 'tell app "LaunchBar" to hide'
else
	for f in "${mounted_path}/"*; do
		echo "${f}"
	done
fi
