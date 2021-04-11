#!/bin/sh

for f in "${@}"; do
	/usr/bin/automator -i "${f}" -D "Path=$(dirname "$f")" "./extract_text.workflow"
done
