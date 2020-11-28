#!/usr/bin/env python3

from datetime import datetime
import os
import copy
import json

delay_values = [3, 5, 10]

now = datetime.now().strftime(r"%Y-%m-%d-%H-%M-%S")
screenshot_file = os.path.join(
    os.getenv("HOME"), "Desktop", "screencapture_{}.png".format(now))

tmp_file = os.path.join(os.getenv("TMPDIR"), "{}.png".format(now))

options = [
    {"title": "Capture Selection to Clipboard", "args": ["-ci"]},
    {"title": "Capture Selection to Desktop", "args": ["-i", screenshot_file]},
    {"title": "Capture Selection to Preview",
        "args": ["-iP", screenshot_file]},
    {
        "title": "Capture Selection to Desktop & Annotate",
        "args": ["-iUu", screenshot_file],
        "use_ui": "Capture Selected Portion"
    },
    {"title": "Capture Selection to Imgur",
        "args": ["-i", tmp_file], "imgur": True},
    {"title": "Capture Screen to Clipboard", "args": ["-Sc", screenshot_file]},
    {"title": "Capture Screen to Desktop", "args": ["-S", screenshot_file]},
    {"title": "Capture Screen to Preview", "args": ["-SP", screenshot_file]},
    {
        "title": "Capture Screen to Desktop & Annotate",
        "args": ["-iUu", screenshot_file],
        "use_ui": "Capture Entire Screen"
    },
    {"title": "Capture Screen to Imgur",
        "args": ["-S", tmp_file], "imgur": True},
    {
        "title": "Record Selection to Desktop & Annotate",
        "args": ["-iUu", screenshot_file],
        "use_ui": "Record Selected Portion"
    },
    {
        "title": "Record Screen to Desktop & Annotate",
        "args": ["-iUu", screenshot_file],
        "use_ui": "Record Entire Screen"
    }
]

output = []
for opt in options:
    opt["actionRunsInBackground"] = True
    opt["actionReturnsItems"] = False
    opt["icon"] = "font-awesome:fa-camera" if opt["title"].startswith(
        "Capture") else "font-awesome:fa-video-camera"
    opt["action"] = "choice.py"
    opt["children"] = []
    for delay_val in delay_values:
        copied_obj = copy.deepcopy(opt)
        copied_obj["delay_value"] = delay_val
        copied_obj["badge"] = "{} seconds delay".format(delay_val)
        opt["children"].append(copied_obj)
    output.append(opt)

print(json.dumps(output))
