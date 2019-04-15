#!/bin/sh
#
# LaunchBar Action Script
#

file=$(mktemp)

text="${1}"
text="${text//$'\n'/[return]}"

config="*.title = New Note
t.type = textfield
t.label = Title
b.type = textbox
b.label = Body
b.default = ${text}
ok.type = defaultbutton
ok.label = OK
cancel.type = cancelbutton
cancel.label = Cancel"

echo "${config}" >> "${file}"

_dialog=$(/Applications/Pashua.app/Contents/MacOS/Pashua "${file}")

while IFS= read -r line; do
	arr+=("${line}")
done <<< "${_dialog}"

# if cancel is pressed
if [[ "${#arr[@]}" -eq 1 ]]; then
	exit 0
fi

echo "${_dialog}"

_body="${arr[0]#*=}"; _body="${_body//\[return\]/$'\n'}"
_title="${arr[1]#*=}"

osascript - "${_title}" "${_body}" <<-EOF
	on run { noteTitle, noteBody }
		set noteBody to paragraphs of noteBody
		set noteBody to noteBody as text
		tell application "Notes" to set theNote to make note with properties {name:noteTitle, body:noteBody}
		set noteId to id of theNote
		set _msg to (noteTitle as text) & " — " & (noteBody as text)
		tell application "LaunchBar"
			display in notification center _msg ¬
				with title "New Note Created" ¬
				subtitle (noteId as text)
		end tell
	end run
EOF

