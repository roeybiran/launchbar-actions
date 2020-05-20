#!/bin/bash

lines=$(python - "${@}" <<-EOF
import sys
lines=[]
for arg in sys.argv[1:]:
  for line in arg.split("\n"):
    if line not in lines:
      lines.append(line)
print("\n".join(lines))
EOF
)

# lines=()
# while IFS=$'\n' read -r line; do
#   if ! printf "%s\n" "${lines[@]}" | grep -E "^${line}$"; then
#     lines+=(var)
#   fi
# done <<<"${@}"

if [[ "${LB_OPTION_COMMAND_KEY}" == "1" ]]; then
  echo "${lines[@]}"
  exit
fi
osascript - "${lines[@]}" <<-EOF
	on run argv
		tell app "LaunchBar"
			hide
			paste in frontmost application (item 1 of argv)
		end tell
	end run
EOF
