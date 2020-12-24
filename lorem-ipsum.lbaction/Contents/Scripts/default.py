#!/usr/bin/env python3

# https://github.com/joke2k/faker
# https://faker.readthedocs.io/en/stable/
# https://faker.readthedocs.io/en/stable/providers.html

import sys
import json
import re

faker_types = [
    "paragraph",
    # "paragraphs",
    "sentence",
    # "sentences",
    "text",
    # "texts",
    "word",
    # "words",
    "name"
]

if len(sys.argv) < 2 or len(sys.argv[1].strip()) == 0:
    print(json.dumps([{"title": x} for x in faker_types]))
    sys.exit()

input = sys.argv[1]
count = re.search(r"\d+", input).group(0)
type = input.replace(count, "").strip()

choice = [{"title": "{} {}".format(count, x), "action": "choice.py", "count": count, "type": x}
          for x in faker_types if type in x]

print(json.dumps(choice))
