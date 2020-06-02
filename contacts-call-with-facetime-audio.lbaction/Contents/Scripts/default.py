#!/usr/bin/env python

import sys
import subprocess
import json
import os

output = []
query = sys.argv[1]

filterer = os.path.expanduser("~/Library/Application Support/LaunchBar/Actions/shared/contactsfetch")
choice_script = os.path.join(os.path.dirname(__file__), "choice.sh")

if os.getenv("LB_OPTION_LIVE_FEEDBACK") == "0":
    args = [choice_script, query]
    subprocess.check_output(args)
    sys.exit()

contacts = subprocess.check_output([filterer, query])
contacts = json.loads(contacts)
for contact in contacts:
    if contact["type"] == "phone":
        output.append(contact)

print(json.dumps(output, indent=2))
