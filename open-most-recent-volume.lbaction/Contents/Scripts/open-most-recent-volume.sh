#!/bin/bash

_vol=$(mount | tail -1 | cut -d' ' -f3) #mount

if [[ "${_vol}" == "map "* ]]; then
	sleep 2
	_vol=$(mount | tail -1 | cut -d' ' -f3) #mount
	if [[ "${_vol}" == "map "* ]]; then
		exit 0
	fi
fi

open "${_vol}"