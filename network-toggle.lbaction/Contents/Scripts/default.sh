#!/bin/bash

wifi_status=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I)
ethcheck=$(networksetup -getnetworkserviceenabled "Ethernet")

eth_tog () {
	networksetup -setnetworkserviceenabled "Ethernet" "${1}"
}

wifi_tog () {
	networksetup -setairportpower "en0" "${1}"
}


if [[ "${ethcheck}" == "Enabled" ]]; then
	eth_tog off
elif [[ "${ethcheck}" == "Disabled" ]]; then
	 eth_tog on
fi

if [[ "${wifi_status}" == "AirPort: Off" ]]; then
	wifi_tog on
else
	wifi_tog off
fi
