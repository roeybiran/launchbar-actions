#!/bin/bash

_W_DEVICE=${_W_DEVICE:-en0}

networksetup -setairportpower ${_W_DEVICE} off
if networksetup -listallnetworkservices | grep "Ethernet"; then
	networksetup -setnetworkserviceenabled "Ethernet" off
fi

sleep 3

networksetup -setairportpower ${_W_DEVICE} on
if networksetup -listallnetworkservices | grep "Ethernet"; then
	networksetup -setnetworkserviceenabled "Ethernet" on
fi
