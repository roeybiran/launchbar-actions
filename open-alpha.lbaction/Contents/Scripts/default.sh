#!/bin/bash

# https://apple.stackexchange.com/questions/210716/applescript-automatically-check-and-remount-server-volume-stopped-working

ARCHIVE_PATH="/Volumes/archive"
SERVER="afp://alpha.local/archive"
for ((i = 0; i < 10; i++)); do
	if ! [[ -d "${ARCHIVE_PATH}" ]]
	then
		open -g -j "${SERVER}"
		sleep 3
	else
		break
	fi
done

paths=("${ARCHIVE_PATH}/"*)
python - "${paths[@]}" <<-EOF
	import json
	import sys
	print json.dumps(map(lambda x: { "path": x }, sys.argv[1:]))
EOF
