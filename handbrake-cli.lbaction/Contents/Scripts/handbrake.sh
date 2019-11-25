#!/bin/bash

preset="${1}"
shift
for f in "${@}"; do
	PARENT_DIR=$(dirname "${f}")
	FILE_NAME=$(basename "${f}"); FILE_NAME="${FILE_NAME%.*}"
	/usr/local/bin/handbrakecli --preset "${preset}" -i "${f}" -o "${PARENT_DIR}/${FILE_NAME}.${preset// /}.mp4"
	touch -r "${f}" "${PARENT_DIR}/${FILE_NAME}.${preset// /}.mp4"
done
