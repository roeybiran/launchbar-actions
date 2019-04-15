#!/bin/sh
#
# LaunchBar Action Script
#
symlinks_dir="${HOME}/Dropbox/dotfiles/symlinks"

if [[ ! -d "${symlinks_dir}" ]]; then
	echo "Could not find base path."
	exit 1
fi

for f in "${@}"; do
	original_dir=$(dirname "${f}")
	file_name=$(basename "${f}")
	newdir="${symlinks_dir}${original_dir}"
	newfile="${newdir}/${file_name}"
	mkdir -p "${newdir}"
	mv "${f}" "${newdir}"
	ln -sf "${newfile}" "${original_dir}"
	sleep 0.1
	open -R "${newfile}"
done
