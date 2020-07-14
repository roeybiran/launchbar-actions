#!/usr/bin/env python

import os
import subprocess
import json
import sys
from xml.etree import ElementTree

if len(sys.argv) == 1:
    sys.exit()

output = subprocess.check_output([
    "/Applications/Dash.app/Contents/Resources/dashAlfredWorkflow", sys.argv[1]
])

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
