#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import re
import subprocess
import json

script = '''
tell application "iTerm"
	tell window 1
		tell tab 1
			tell session 1
				return its text
			end tell
		end tell
	end tell
end tell
'''

output = subprocess.check_output(
    ["/usr/bin/osascript", "-e", script], encoding="utf-8").split('\n')
output = filter(lambda x: not re.match(r"^\s*$", x, re.MULTILINE), output)
output = "\n".join(output)
print(json.dumps(output))
