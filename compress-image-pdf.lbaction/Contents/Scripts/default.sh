#!/bin/bash

for file in "${@}"; do
	dirname="$(dirname "${file}")"
	filename="$(basename "${file}")"
	# pdfs
	if [[ "${file}" == *.pdf ]]; then
		automator -i "${file}" -D "Path=${dirname}" "./Compress Images in PDFs.workflow"
	else
		# images
		# https://stackoverflow.com/questions/7261855/recommendation-for-compressing-jpg-files-with-imagemagick
		args=("${file}" "${dirname}/COMPRESSED_${filename}")
		automator -i "$(printf "%s\n" "${args[@]}")" "./Compress Images.workflow"
	fi
done
