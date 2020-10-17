#!/usr/bin/env python

import os
import subprocess
import json
import sys
from xml.etree import ElementTree

# https://kapeli.com/dash_plugins
# /Applications/LaunchBar.app/Contents/Resources/Actions/Search Dash.lbaction/Contents/Scripts/default.rb

if len(sys.argv) == 1:
    sys.exit()

output = subprocess.check_output([
    "/Applications/Dash.app/Contents/Resources/dashAlfredWorkflow", sys.argv[1]
])

"""
Normally, this script is run for live feedback and returns items that are
opened using open.sh. But if the user hits enter before a previous run of
this script could return any items (e.g. because nothing was found or the
"dash" utility takes too long), this script is not run for live feedback
and Dash should just be opened with the current search term instead.
"""

if os.getenv("LB_OPTION_LIVE_FEEDBACK") == "0":
    subprocess.check_output(
        ["/usr/bin/open", "-g", "dash://{}".format(sys.argv[1])])
    sys.exit()

items = []
for idx, val in enumerate(
        ElementTree.fromstring(output).find("items").findall("item")):
    item = {
        "title": val.findtext("title"),
        "subtitle": val.findall("subtitle")[-1].text,
        "icon": val.findtext("icon"),
        "actionArgument": str(idx),
        "action": "open.sh",
        "actionRunsInBackground": True,
        "actionReturnsItems": False
    }
    items.append(item)

print(json.dumps(items))
