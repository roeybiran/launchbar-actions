#!/bin/sh

wifi_switch () {
	/usr/sbin/networksetup -setairportpower "en0" "${1}"
	return 0
}

ethernet_switch () {
	/usr/sbin/networksetup -setnetworkserviceenabled "Ethernet" "${1}"
	return 0
}

wifi_switch off
ethernet_switch off
/bin/sleep 3
wifi_switch on
ethernet_switch on
