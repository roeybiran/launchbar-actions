#!/bin/sh

osascript "${HOME}/Library/Application Support/LaunchBar/Actions/shared/call.scpt" "tel:$(echo "${1}" | sed -E 's/[[:space:]]//g')"
