#!/usr/bin/env python3

import json
import sys
import subprocess
import time
import re
import os
import shutil


def async_applescript(script):
    subprocess.Popen(["/usr/bin/osascript", "-e", "delay 0.5", "-e", script])


subprocess.check_output(
    ["/usr/bin/osascript", "-e", 'tell application "LaunchBar" to hide']
)

arg = json.loads(sys.argv[1])
screencapture_options = arg["screencapture_options"]
destination = ""

if arg.get("destination"):
    dirname = arg["destination"]["path"]
    basename = arg["destination"]["name"]
    extension = arg["destination"]["extension"]
    # destination file deduplication
    destination = os.path.join(dirname, basename) + "." + extension
    while os.path.exists(destination):
        basename += "_copy"
        destination = os.path.join(dirname, basename) + "." + extension

if arg.get("delay_value"):
    time.sleep(arg["delay_value"])
elif re.match(r"-Sc|-S|-SP", screencapture_options):
    # delay in case of full screen capture, so we won't see launchbar itself
    time.sleep(1)


if arg.get("use_ui"):
    async_applescript(
        f'tell application "System Events" to tell application process "screencaptureui" to tell window 1 to click checkbox "{arg["use_ui"]}"'
    )

subprocess.check_output(
    ["/usr/sbin/screencapture", screencapture_options, '-tjpg', destination])

if arg.get("use_ui"):
    async_applescript(
        'tell application "System Events" to click button 1 of window 1 of application process "Screen Shot"'
    )

if arg.get("imgur"):
    home = os.getenv("HOME")
    trash = os.path.join(home, ".Trash")
    src = destination
    script = os.path.join(
        home,
        "Library/Application Support/LaunchBar/Actions/shared/upload-to-imgur/main.sh",
    )
    subprocess.check_output([script, src])
    shutil.move(src, trash)
