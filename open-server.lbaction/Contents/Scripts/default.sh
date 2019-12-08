#!/bin/bash

# https://apple.stackexchange.com/questions/210716/applescript-automatically-check-and-remount-server-volume-stopped-working

SERVER_PATH="afp://alpha.local/archive"
mounted_path="/Volumes/$(basename "${SERVER_PATH}")"

for ((i = 0; i < 10; i++)); do
	if ! [[ -d "${mounted_path}" ]]
	then
		open -g -j "${SERVER}"
		sleep 3
	else
		break
	fi
done

paths=("${mounted_path}/"*)
python - "${paths[@]}" <<-EOF
	import json
	import sys
	print json.dumps(map(lambda x: { "path": x }, sys.argv[1:]))
EOF
