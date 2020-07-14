#!/bin/bash

# https://skorks.com/2010/03/how-to-quickly-generate-a-large-file-on-the-command-line-with-linux/

size=$(
	osascript <<-EOF
		set sizes to {100, 250, 500, 1000, 2000, 3000, 3000, 4000, 5000}
		set theList to choose from list sizes ¬
			with title "Choose Size (in MB)" default items (item 1 of sizes) ¬
			multiple selections allowed false ¬
			without empty selection allowed
		try
			return item 1 of theList
		on error
			return ""
		end try
	EOF
)

test -z "${size}" && exit

for f in "${@}"; do
	path="${f}/${RANDOM}.txt"
	/bin/dd if=/dev/zero of="${path}" count=$((size * 1024)) bs=1024 1>/dev/null
done
