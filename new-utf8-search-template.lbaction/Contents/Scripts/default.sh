#!/bin/bash

plist="${HOME}/Library/Application Support/LaunchBar/Configuration.plist"
rule_count=$(/usr/libexec/PlistBuddy -c "Print :rules" "${plist}" | grep -c "    Dict {")

arg="${1}"

# format: name,url...

name="$(echo "${arg}" | cut -d"," -f1)"
url="$(echo "${arg}" | cut -d"," -f2)"

if [[ -z "${name}" || -z "${url}" || -z "$(echo "${url}" | grep '*')" ]]; then
	osascript -e "display alert \"Error: either name or URL were empty, or URL did not include an asterisk.\""
	exit
fi

for ((i = 0; i < "${rule_count}"; i++)); do
	rule_name=$(/usr/libexec/PlistBuddy -c "Print rules:$i:aliasName" "${plist}" 2>/dev/null)
	if [[ "${rule_name}" == "Search Templates (UTF-8)" ]]; then
		/usr/libexec/PlistBuddy -c "Add rules:$i:templates:0 dict" "${plist}"
		/usr/libexec/PlistBuddy -c "Add rules:$i:templates:0:name string \"${name}\"" "${plist}"
		/usr/libexec/PlistBuddy -c "Add rules:$i:templates:0:templateURL string \"${url}\"" "${plist}"
		exit
	fi
done
