#!/bin/bash
#
# LaunchBar Action Script
#

for f in "$@"; do
	h="$(/usr/bin/sips -g pixelHeight "${f}" | tail -n 1 | awk '{print $NF}')"
	w="$(/usr/bin/sips -g pixelWidth "${f}" | tail -n 1 | awk '{print $NF}')"

	if [[ "${h}" -gt "${w}" ]]; then
		targetsize="${h}"
	else
		targetsize="${w}"
	fi
	/usr/bin/sips -Z $((targetsize / 3)) "${f}"
done
