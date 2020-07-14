#!/usr/bin/env python

import json
import subprocess
import sys

input = json.loads(sys.argv[1])

scpt = """
on run argv
	set volumePath to item 1 of argv
	set imagePath to item 2 of argv
	tell application "Finder"
		eject (POSIX file volumePath as alias)
		delay 0.5
		delete (POSIX file imagePath as alias)
	end tell
end run
"""

for image in input["images"]:
    subprocess.check_output([
        "/usr/bin/osascript", "-e", scpt, image["volume_path"],
        image["image_file_path"]
    ])
