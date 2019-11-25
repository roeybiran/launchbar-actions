#!/bin/bash

count="${1}"
finderWindow=$(osascript -e 'tell application "Finder" to return (POSIX path of (insertion location as alias))')
cd "${finderWindow}" || exit

for ((i=0;i<count;i++)); do
	touch "untitled ${i}.txt"
done
