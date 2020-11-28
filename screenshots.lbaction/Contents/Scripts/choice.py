#!/usr/bin/env python3

import json
import sys
import subprocess
import time
import re
import os
import shutil


def async_applescript(script):
    subprocess.Popen(
        ["/usr/bin/osascript", "-e", "delay 0.5", "-e", script])


subprocess.check_output(
    ["/usr/bin/osascript", "-e", 'tell application "LaunchBar" to hide'])

arg = json.loads(sys.argv[1])

if arg.get("delay_value"):
    time.sleep(arg["delay_value"])
elif re.match(r"-Sc|-S|-SP", arg["args"][0]):
    time.sleep(1)

use_ui = arg.get("use_ui")

if use_ui:
    async_applescript('tell application "System Events" to tell application process "screencaptureui" to tell window 1 to click checkbox "{}"'.format(
        arg["use_ui"]))

subprocess.check_output(["/usr/sbin/screencapture"] + arg["args"])

if use_ui:
    async_applescript(
        'tell application "System Events" to click button 1 of window 1 of application process "Screen Shot"')

if arg.get("imgur"):
    home = os.getenv("HOME")
    trash = os.path.join(home, ".Trash")
    src = arg["args"][1]
    script = os.path.join(
        home, "Library/Application Support/LaunchBar/Actions/shared/upload-to-imgur/main.sh")
    subprocess.check_output([script, src])
    shutil.move(src, trash)
