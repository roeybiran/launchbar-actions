#!/usr/bin/env python

# https://ncalculators.com/number-conversion/xis-what-percent-ofy-calculator.htm

import sys
import json
import re

input = sys.argv[1]
# input = r"80% of 255"

match = re.search(r"(\d+)% of (\d+)", input)
if match:
    partial = float(match.group(1))
    total = float(match.group(2))
    result = (partial / 100) * total
    formula = "({} / 100) * {}".format(partial, total)

match = re.search(r"(\d+) of (\d+)", input)
if match:
    partial = float(match.group(1))
    total = float(match.group(2))
    result = "{}%".format(int((partial / total) * 100))
    formula = "({} / {}) * 100".format(partial, total)

obj = {}
obj["title"] = str(result)
obj["subtitle"] = "Formula: {}".format(formula)

print(json.dumps([obj]))
