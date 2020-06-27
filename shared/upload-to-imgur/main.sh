#!/bin/bash

# https://apidocs.imgur.com/?version=latest

# setup:
# register an "app": https://api.imgur.com/oauth2/addclient (or view current apps here: https://imgur.com/account/settings/apps)
# get the client-id and client-secret
# use both to get a refresh token
# create a property list named "config.plist" and put it in the same folder as this script
# the plist should have the following body (you may copy and paste it)
# <dict>
# <key>access_token</key>
# <string></string>
# <key>access_token_expiry</key>
# <integer>0</integer>
# <key>client_id</key>
# <string></string>
# <key>client_secret</key>
# <string></string>
# <key>refresh_token</key>
# <string></string>
# </dict>
# save the client id, client secret and refresh token under the respective keys in the plist

SOURCE="${BASH_SOURCE[0]}"

# resolve $SOURCE until the file is no longer a symlink
while [[ -L "${SOURCE}" ]]; do
	DIR="$(cd -P "$(dirname "${SOURCE}")" >/dev/null 2>&1 && pwd)"
	SOURCE="$(readlink "${SOURCE}")"
	# if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
	[[ "${SOURCE}" != /* ]] && SOURCE="${DIR}/${SOURCE}"
done

PLIST="$(dirname "${SOURCE}")/config.plist"

if [[ ! -f "${PLIST}" ]]; then
	for s in ":client_id string" ":client_secret string" ":refresh_token string" ":access_token string" ":access_token_expiry integer"; do
		/usr/libexec/PlistBuddy -c "Add ${s}" "${PLIST}"
	done
fi

client_id=$(/usr/libexec/PlistBuddy -c "Print :client_id" "${PLIST}") 2>/dev/null
client_secret=$(/usr/libexec/PlistBuddy -c "Print :client_secret" "${PLIST}") 2>/dev/null
refresh_token=$(/usr/libexec/PlistBuddy -c "Print :refresh_token" "${PLIST}") 2>/dev/null

for s in "${client_id}" "${client_secret}" "${refresh_token}"; do
	if [[ -z "${s}" ]]; then
		osascript -e 'display alert "Missing client ID, client secret or refresh token. Please fill them in the config.plist file in the support folder of this action." as critical'
		exit
	fi
done

access_token=$(/usr/libexec/PlistBuddy -c "Print :access_token" "${PLIST}") 2>/dev/null
access_token_expiry=$(/usr/libexec/PlistBuddy -c "Print :access_token_expiry" "${PLIST}") 2>/dev/null

now=$(date +%s)

if [[ -z "${access_token}" ]] || [[ "${access_token_expiry}" == 0 ]] || [[ "${now}" -gt "${access_token_expiry}" ]]; then
	json=$(
		curl --location --request POST 'https://api.imgur.com/oauth2/token' \
			--form "refresh_token=$refresh_token" \
			--form "client_id=$client_id" \
			--form "client_secret=$client_secret" \
			--form "grant_type=refresh_token"
	)
	echo "${json}"
	parsed=$(
		python - "${json}" <<-EOF
			import sys
			import json
			json = json.loads(sys.argv[1])
			print(json["access_token"])
			print(json["expires_in"])
		EOF
	)
	access_token="$(echo "${parsed}" | sed -n '1p')"
	expiry="$(echo "${parsed}" | sed -n '2p')"
	expiry=$((now + expiry / 1000))
	/usr/libexec/PlistBuddy -c "Set :access_token ${access_token}" "${PLIST}"
	/usr/libexec/PlistBuddy -c "Set :access_token_expiry ${expiry}" "${PLIST}"
fi

open -g "hammerspoon://start-task-with-progress" 2>/dev/null

total_files="$#"
links=()
for f in "$@"; do
	type="image"
	for ext in "mp4" "mkv" "mov" "flv"; do
		if basename "${f}" | grep --silent -E "\.$ext^"; then
			type="video"
			break
		fi
	done

	json=$(
		curl --location --request POST 'https://api.imgur.com/3/image' \
			--header "Authorization: Bearer ${access_token}" \
			--form "${type}=@${f}"
	)
	echo "${json}"
	parsed=$(
		python - "${json}" <<-EOF
			import sys
			import json
			json = json.loads(sys.argv[1])
			if json["success"]:
			  print(json["data"]["link"])
		EOF
	)
	test -n "${parsed}" && links+=("${parsed}")
done

osascript -e "tell app \"LaunchBar\" to display in notification center \"${#links[@]}/${total_files} uploaded OK. Links copied to clipboard.\""
printf "%s\n" "${links[@]}" | perl -pe 'chomp if eof' | pbcopy

open -g "hammerspoon://stop-task-with-progress" 2>/dev/null
