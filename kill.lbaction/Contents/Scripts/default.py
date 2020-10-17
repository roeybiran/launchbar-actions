#!/usr/bin/env python
#
# LaunchBar Action Script
#
import plistlib
import os
import subprocess
import re
import json
import sys
import signal

# called from launchbar following user's choice
if len(sys.argv) > 1:
    os.kill(int(sys.argv[1]), signal.SIGINT)


procs = subprocess.check_output(["/bin/ps", "rAo",
                                 r"pid=,%cpu=,comm="]).rstrip().split("\n")

seen = []
output = []
for proc in procs:
    proc = re.sub(r"\s{2,}", " ", proc)
    proc = proc.lstrip().split(" ")
    pid = proc[0]
    cpu = proc[1]
    path = " ".join(proc[2:])
    # avoid duplicates
    if path in seen:
        continue
    else:
        seen.append(path)
    name = os.path.basename(path)
    icon = "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ExecutableBinaryIcon.icns"
    if ".app/" in path:
        match = re.search(r'^.+?\.app/Contents', path)
        if match:
            base_dir = match.group(0)
            plist = os.path.join(base_dir, "Info.plist")
            if os.path.isfile(plist):
                try:
                    icon = plistlib.readPlist(plist)["CFBundleIconFile"]
                    if not icon.endswith(".icns"):
                        icon = icon + ".icns"
                    icon = os.path.join(base_dir, "Resources", icon)
                except Exception as e:
                    pass

    output.append({
        "title": name,
        "subtitle": path,
        "icon": icon,
        "action": "default.py",
        "actionArgument": pid,
        "actionRunsInBackground": True,
        "actionReturnsItems": False,
        "badge": "CPU: %" + cpu
    })

print(json.dumps(output))
