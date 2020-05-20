#!/bin/bash

PATH=$PATH:/usr/local/bin

for prog in pdftk tesseract; do
	if ! command -v "${prog}"; then
		exit
	fi
done

open -g "hammerspoon://start-task-with-progress"
tmpdir="$(mktemp -d)"
for pdf in "${@}"; do
	dir="$(dirname "${pdf}")"
	name="$(basename "${pdf}" | sed -E 's/\.pdf$//')"
	cd "${tmpdir}" || exit
	pdftk "${pdf}" burst output output_%02d.pdf
	rm ./*.txt
	sips -s format tiff ./*.pdf --out "$PWD/"
	for tiff in "${tmpdir}/"*.tiff; do
		tesseract "${tiff}" var -l heb+eng PDF
	done
	cd "${dir}" || exit
	target="${dir}/${name}_OCR.pdf"
	pdftk "${tmpdir}/"*.pdf cat output "${target}"
	echo "${dir}/${name}_OCR.pdf" | pbcopy
done
open -g "hammerspoon://stop-task-with-progress"
