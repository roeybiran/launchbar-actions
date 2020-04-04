#!/bin/bash

# https://apple.stackexchange.com/questions/210716/applescript-automatically-check-and-remount-server-volume-stopped-working

SERVER_PATH="afp://alpha.local/archive"
mounted_path="/Volumes/$(basename "${SERVER_PATH}")"

if ! [[ -d "${mounted_path}" ]]; then
	open "${SERVER_PATH}"
else
	for f in "${mounted_path}"/*; do
		echo "${f}"
	done
fi
