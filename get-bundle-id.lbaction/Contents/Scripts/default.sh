#!/bin/bash

bundles=()
for app in "${@}"; do
	plist="${app}/Contents/Info.plist"
	bundle_id="$(/usr/libexec/PlistBuddy -c "Print :CFBundleIdentifier" "${plist}" 2>/dev/null)"
	bundles+=("${bundle_id}")
done

printf "%s\n" "${bundles[@]}" | tee >(pbcopy)
