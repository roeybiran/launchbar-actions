#!/usr/bin/env python

import sys
import plistlib
import subprocess
import json
import os
import re

address = sys.argv[1]
is_connected = subprocess.check_output(
    ["/usr/local/bin/blueutil", "--is-connected", address]) == "1"

if is_connected:
    argument = "--disconnect"
else:
    argument = "--connect"

subprocess.check_output(["/usr/local/bin/blueutil", argument, address])
