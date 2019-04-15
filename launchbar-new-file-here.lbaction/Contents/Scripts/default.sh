#!/bin/sh

output=$(/usr/local/bin/node ./index.js "${@}")

echo "${output}"
