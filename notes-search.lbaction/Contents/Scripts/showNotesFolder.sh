#!/usr/bin/env bash

/usr/bin/osascript - "${1}" <<-EOF
    on run argv
        tell application "LaunchBar" to hide
        tell application "Notes"
            activate
            show folder id (item 1 of argv as text)
        end tell
    end run
EOF
