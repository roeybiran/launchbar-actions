#!/bin/bash

_W_DEVICE=${_W_DEVICE:-en0}
wifi_status=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I)

if networksetup -listallnetworkservices | grep "Ethernet"; then
	ethcheck=$(networksetup -getnetworkserviceenabled "Ethernet")
	if [[ "${ethcheck}" == "Enabled" ]]; then
		networksetup -setnetworkserviceenabled "Ethernet" off
	elif [[ "${ethcheck}" == "Disabled" ]]; then
		networksetup -setnetworkserviceenabled "Ethernet" on
	fi
fi


if [[ "${wifi_status}" == "AirPort: Off" ]]; then
	networksetup -setairportpower ${_W_DEVICE} on
else
	networksetup -setairportpower ${_W_DEVICE} off
fi
