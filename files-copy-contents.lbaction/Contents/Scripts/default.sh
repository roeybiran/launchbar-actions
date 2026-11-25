#!/bin/bash

files=()
for f in "${@}"; do
	if [ -f "${f}" ]; then
		files+=("${f}")
	fi
done

if [ "${#files[@]}" -eq 0 ]; then
	echo "No regular files provided."
	exit 1
fi

cat -- "${files[@]}" | pbcopy
printf "Copied contents of %d file(s) to clipboard.\n" "${#files[@]}"
