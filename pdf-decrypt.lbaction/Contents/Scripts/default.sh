#!/bin/bash

qpdf=/opt/homebrew/bin/qpdf
if ! [ -e "$qpdf" ]; then
    osascript -e 'tell application "LaunchBar" to display alert "This script requires \"qpdf\". Run \"brew install qpdf\" to install."'
    exit 0
fi

password=$(osascript <<EOF
try
    text returned of (display dialog "Enter the password for the PDF" default answer "" with hidden answer)
end try
EOF
)

if [ -z "$password" ]; then
    exit 0
fi

for file in "${@}"; do
    out="${file%.pdf}_decrypted.pdf"
    /opt/homebrew/bin/qpdf --password="${password}" --decrypt "${file}" "${out}"
    echo "${out}"
done