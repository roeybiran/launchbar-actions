#!/bin/sh
#
# LaunchBar Action Script
#

# https://apple.stackexchange.com/questions/225241/batch-compress-multiple-folders-into-individual-zip-files
# echo "$# arguments passed"

for f in "$@"; do
    dn="$(dirname "$f")"
    bn="$(basename "$f")"

    pushd "$dn"

if [[ -d "$f" ]]; then
    if [[ ! -e "$bn.zip" ]]; then
        ditto -c -k --sequesterRsrc --keepParent "$f" "$bn.zip"
    else
        n=2
        for i in $bn *.zip; do
            if [[ "$bn $n.zip" == "$i" ]]; then
                n="$(( $n + 1 ))"
            fi
        done
        ditto -c -k --sequesterRsrc --keepParent "$f" "$bn $n.zip"
    fi
else
    if [[ ! -e "$bn.zip" ]]; then
        ditto -c -k --sequesterRsrc "$f" "$bn.zip"
    else
        n=2
        for i in $bn *.zip; do
            if [[ "$bn $n.zip" == "$i" ]]; then
                n="$(( $n + 1 ))"
            fi
        done
        ditto -c -k --sequesterRsrc "$f" "$bn $n.zip"
    fi
fi
done
