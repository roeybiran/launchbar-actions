#!/usr/bin/env python3

from datetime import datetime
import os
import copy
import json

delay_values = [3, 5, 10]

now = datetime.now().strftime(r"%Y-%m-%d-%H-%M-%S")

screenshot_file = {
    "path": os.path.join(os.getenv("HOME"), "Desktop"),
    "name": f"screencapture_{now}",
    "extension": "jpg",
}

tmp_file = {"path": os.getenv("TMPDIR"), "name": f"{now}", "extension": "jpg"}

options = [
    {
        "title": "Capture Selection to Clipboard",
        "screencapture_options": "-ci",
        "destination": None,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Selection to Desktop",
        "screencapture_options": "-i",
        "destination": screenshot_file,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Selection to Preview",
        "screencapture_options": "-iP",
        "destination": screenshot_file,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Selection to Desktop & Annotate",
        "screencapture_options": "-iUu",
        "destination": screenshot_file,
        "use_ui": "Capture Selected Portion",
        "imgur": False,
    },
    {
        "title": "Capture Selection to Imgur",
        "screencapture_options": "-i",
        "destination": tmp_file,
        "use_ui": False,
        "imgur": True,
    },
    {
        "title": "Capture Screen to Clipboard",
        "screencapture_options": "-Sc",
        "destination": screenshot_file,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Screen to Desktop",
        "screencapture_options": "-S",
        "destination": screenshot_file,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Screen to Preview",
        "screencapture_options": "-SP",
        "destination": screenshot_file,
        "use_ui": False,
        "imgur": False,
    },
    {
        "title": "Capture Screen to Desktop & Annotate",
        "screencapture_options": "-iUu",
        "destination": screenshot_file,
        "use_ui": "Capture Entire Screen",
        "imgur": False,
    },
    {
        "title": "Capture Screen to Imgur",
        "screencapture_options": "-S",
        "destination": tmp_file,
        "use_ui": False,
        "imgur": True,
    },
    {
        "title": "Record Selection to Desktop & Annotate",
        "screencapture_options": "-iUu",
        "destination": screenshot_file,
        "use_ui": "Record Selected Portion",
        "imgur": False,
    },
    {
        "title": "Record Screen to Desktop & Annotate",
        "screencapture_options": "-iUu",
        "use_ui": "Record Entire Screen",
        "destination": screenshot_file,
        "imgur": False,
    },
]

output = []
for opt in options:
    opt["actionRunsInBackground"] = True
    opt["actionReturnsItems"] = False
    opt["icon"] = (
        "font-awesome:fa-camera"
        if opt["title"].startswith("Capture")
        else "font-awesome:fa-video-camera"
    )
    opt["action"] = "choice.py"
    opt["delay_value"] = None
    opt["children"] = []
    for delay_val in delay_values:
        copied_obj = copy.deepcopy(opt)
        copied_obj["delay_value"] = delay_val
        copied_obj["badge"] = "{} seconds delay".format(delay_val)
        opt["children"].append(copied_obj)
    output.append(opt)

print(json.dumps(output))
