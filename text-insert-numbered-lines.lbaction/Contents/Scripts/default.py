#!/usr/bin/env python
#
# LaunchBar Action Script
#

import subprocess
import re
import sys

input = sys.argv[1]
input = re.split(r"-|,", input)
start = int(input[0])
stop = int(input[1])
try:
    step = int(input[2])
except IndexError as e:
    step = 1
output = []
for i in range(start, stop + 1, step):
    output.append(str(i))

subprocess.check_output([
    "/usr/bin/osascript", "-e",
    'tell app "LaunchBar" to paste in frontmost application "{}"'.format(
        "\n".join(output))
])
