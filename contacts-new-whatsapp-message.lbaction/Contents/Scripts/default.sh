#!/bin/bash
#
# LaunchBar Action Script
#

number="${1}"
if [[ "${number}" == "0"* ]]; then
	number="$(printf "%s\n" "${number}" | sed -E 's/0/972/' | sed -E 's/[^[:digit:]]//')"
fi
open "https://api.whatsapp.com/send?phone=${number}"

# FIXME: doesn't work:
# open -a "/Applications/WhatsApp.app" --args "https://web.whatsapp.com/send?phone=${number}"
# open "https://web.whatsapp.com/send?phone=${number}"
