#!/bin/sh

if networksetup -getairportpower en0 | grep -q "On"; then
	networksetup -setairportpower en0 off
else
	networksetup -setairportpower en0 on
fi
