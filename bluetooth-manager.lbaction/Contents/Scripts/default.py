#!/usr/bin/env python
# -*- coding: utf-8 -*-

import plistlib
import subprocess
import json
import os

DEVNULL = open(os.devnull, "w")
devices = subprocess.check_output([
    "/usr/sbin/system_profiler", "SPBluetoothDataType", "-detailLevel", "full",
    "-xml"
],
    stderr=DEVNULL)

items = []
devices = plistlib.readPlistFromString(devices)[0]["_items"][0]["device_title"]
for dev in devices:
    key_name = dev.keys()[0]
    properties = dev[key_name]
    subtitle = properties.get('device_minorClassOfDevice_string')
    battery = properties.get('device_batteryPercent')
    mac_address = properties.get('device_addr')
    item = {
        "title": key_name,
        "subtitle": subtitle,
        "icon": "font-awesome:fa-bluetooth",
        "badge": battery,
        "label": mac_address,
        "actionArgument": mac_address,
        "action": "choice.py"
    }
    items.append(item)

print(json.dumps(items))
