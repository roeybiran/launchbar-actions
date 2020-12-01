#!/usr/bin/env python3
#
# LaunchBar Action Script
#
import subprocess
import json

for d in json.loads(subprocess.check_output(["/usr/local/bin/blueutil", "--paired", "--format", "json"])):
    if d["connected"]:
        subprocess.check_output(
            ["/usr/local/bin/blueutil", "--disconnect", d["address"]])
