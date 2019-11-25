#!/usr/bin/env sh

text_input="${1}"
current_clipboard=$(/usr/bin/pbpaste)
/usr/bin/printf "%s\n%s" "${text_input}" "${current_clipboard}" | /usr/bin/pbcopy
