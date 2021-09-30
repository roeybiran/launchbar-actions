#!/bin/bash
#
# LaunchBar Action Script
#

conf="
destination.type = radiobutton
destination.rely = -20
destination.label = Destination:
destination.option = Next to originals
destination.default = Next to originals
destination.option = Overwrite
destination.option = Other...
pathpicker.type = openbrowser
pathpicker.default = ${HOME}/Desktop
trash.type = checkbox
trash.label = Delete originals
mode.type = radiobutton
mode.label = Scale by:
mode.option = Percentage
mode.option = Dimensions
mode.default = Percentage
modevalue.type = textfield
modevalue.label = Value:
modevalue.placeholder = e.g. 640px, or 50%
ok.type = defaultbutton
cancel.type = cancelbutton
"

result="$(echo "${conf}" | /Applications/Pashua.app/Contents/MacOS/Pashua -)"

parse() {
	local key="${1}"
	echo "${result}" | grep -E "${key}=" | sed -E 's/^[[:alnum:]]+=//'
}

if echo "${result}" | grep "cancel=1"; then exit 0; fi
for f in "${@}"; do
	dir="$(dirname "${f}")"
	name="$(basename "${f}")"
	destination="$(parse destination)"

	case "${destination}" in
	"Next to originals")
		destination="${dir}/EDITED_${name}"
		;;
	"Overwrite")
		:
		;;
	"Other...")
		destination="$(parse pathpicker)"
		;;
	esac

	h="$(sips -g pixelHeight "${f}" | tail -n 1 | awk '{print $NF}')"
	w="$(sips -g pixelWidth "${f}" | tail -n 1 | awk '{print $NF}')"
	if [[ "${h}" -gt "${w}" ]]; then
		largest_dimension="${h}"
	else
		largest_dimension="${w}"
	fi
	# https://unix.stackexchange.com/questions/40786/how-to-do-integer-float-calculations-in-bash-or-other-languages-frameworks

	mode="$(parse mode)"
	value="$(parse modevalue | sed -E 's/%|px//')"

	if [[ "${mode}" == Percentage ]]; then
		targetsize="$(perl -E "say $largest_dimension * ($value / 100)" | awk '{print int($1)}')"
	else
		targetsize="${value}"
	fi

	sips "${f}" -Z "${targetsize}" --out "${destination}"
done

# if [[ "${checkbox_trash}" == "1" ]]; then
# /usr/local/bin/trash "${@}"
# fi
