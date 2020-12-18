#!/usr/bin/env python3

import json
import sys
from faker import Faker

obj = json.loads(sys.argv[1])
type = obj["type"]
count = int(obj["count"])

fake = Faker()
func = getattr(fake, type)

print(json.dumps([{"title": func()} for _ in range(0, count)]))
