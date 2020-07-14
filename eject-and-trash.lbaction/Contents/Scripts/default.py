#!/usr/bin/env python

import json
import plistlib
import subprocess

output = []
all_images = []
for image in plistlib.readPlistFromString(
        subprocess.check_output(["/usr/bin/hdiutil", "info",
                                 "-plist"]))["images"]:
    entities_length = len(image["system-entities"])
    volume_path = image["system-entities"][entities_length - 1]["mount-point"]
    image_file_path = image["image-path"]
    imageinfo = {
        "volume_path": volume_path,
        "image_file_path": image_file_path
    }
    all_images.append(imageinfo)
    item = {
        "title": volume_path,
        "subtitle": image_file_path,
        "icon": image["icon-path"],
        "images": [imageinfo],
        "action": "eject.py",
        "actionRunsInBackground": True,
        "actionRetrunsItems": False
    }
    output.append(item)

if len(output) > 1:
    item = {
        "title": "Eject & Trash All",
        "images": all_images,
        "action": "eject.py",
        "actionRunsInBackground": True,
        "actionRetrunsItems": False
    }
    output.append(item)

print(json.dumps(output))
