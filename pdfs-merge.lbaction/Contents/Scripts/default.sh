#!/bin/bash

files="$(printf "%s\n" "${@}" | sort)"
first_file_path="$(printf "%s\n" "${files}" | head -n 1)"
first_file_name_no_ext="$(basename "${first_file_path}" | cut -f 1 -d'.')"
first_file_dir="$(dirname "${first_file_path}")"
count="$(printf "%s\n" "${files}" | wc -l | sed '/[:space:]/d')"
count=$((count - 1))
final_name="${first_file_dir}/${first_file_name_no_ext} and ${count} others.pdf"

/usr/local/bin/gs -dQUIET -dNOPAUSE -dSAFER -dBATCH -sDEVICE=pdfwrite -sOutputFile="${final_name}" "${@}"

dialog=$(/usr/bin/osascript <<-EOF
	tell application "System Events" to set d to display dialog "Delete originals?" buttons {"No", "Yes"} default button "Yes"
	return button returned of d
EOF
)
if [[ "${dialog}" == "Yes" ]]
then
	/usr/local/bin/node /usr/local/bin/trash "${@}" &>~/Desktop/1.foo
fi
/usr/bin/osascript - "${final_name}" <<-EOF
	on run argv
		tell app "LaunchBar" to open (item 1 of argv)
	end run
EOF
