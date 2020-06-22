#!/bin/bash

paths=()
for arg in "${@}"; do
	paths+=("$(sed -E "s|^${HOME}|~|" <<< "${arg}")")
done
printf "%s\n" "${paths[@]}"
