#!/bin/bash

set -euo pipefail

sanitize_input() {
	perl -CS -Mutf8 -pe '
		s/\x{FEFF}//g;
		s/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]//g;
		s/[\x{00AD}\x{200B}\x{200C}\x{200D}\x{2060}]//g;
		s/\A\s+//;
		s/\s+\z//;
	'
}

strip_wrapping_quotes() {
	local value="$1"

	if [[ ${#value} -ge 2 ]]; then
		if [[ ${value:0:1} == "\"" && ${value: -1} == "\"" ]]; then
			printf '%s' "${value:1:${#value}-2}"
			return
		fi

		if [[ ${value:0:1} == "'" && ${value: -1} == "'" ]]; then
			printf '%s' "${value:1:${#value}-2}"
			return
		fi
	fi

	printf '%s' "$value"
}

decode_file_url() {
	INPUT_PATH="$1" python3 <<'PY'
import os
import urllib.parse

parsed = urllib.parse.urlparse(os.environ["INPUT_PATH"])
print(urllib.parse.unquote(parsed.path or ""), end="")
PY
}

expand_home() {
	local path="$1"

	case "$path" in
		"~")
			printf '%s' "$HOME"
			;;
		"~/"*)
			printf '%s/%s' "$HOME" "${path:2}"
			;;
		*)
			printf '%s' "$path"
			;;
	esac
}

normalize_input() {
	local path="$1"

	case "$path" in
		file://*)
			path="$(decode_file_url "$path")"
			;;
	esac

	path="$(expand_home "$path")"
	printf '%s' "$path"
}

url_encode() {
	INPUT_PATH="$1" python3 <<'PY'
import os
import urllib.parse

print(urllib.parse.quote(os.environ["INPUT_PATH"], safe=""), end="")
PY
}

canonicalize_path() {
	local path="$1"
	local dir

	if [[ ! -e "$path" ]]; then
		printf '%s' "$path"
		return
	fi

	dir="$(cd "$(dirname "$path")" && pwd -P)"
	printf '%s/%s' "$dir" "$(basename "$path")"
}

raw_input="${1-}"
if [[ -z "$raw_input" ]]; then
	printf 'Provide a file path.\n' >&2
	exit 1
fi

cleaned_path="$(printf '%s' "$raw_input" | sanitize_input)"
cleaned_path="$(strip_wrapping_quotes "$cleaned_path")"
cleaned_path="$(printf '%s' "$cleaned_path" | sanitize_input)"
cleaned_path="$(normalize_input "$cleaned_path")"
cleaned_path="$(canonicalize_path "$cleaned_path")"

if [[ -z "$cleaned_path" ]]; then
	printf 'Provide a non-empty file path.\n' >&2
	exit 1
fi

if [[ ! -e "$cleaned_path" ]]; then
	printf 'File not found: %s\n' "$cleaned_path" >&2
	exit 1
fi

encoded_path="$(url_encode "$cleaned_path")"
/usr/bin/open "x-launchbar:select?file=${encoded_path}"
printf 'Selected in LaunchBar: %s\n' "$cleaned_path"
