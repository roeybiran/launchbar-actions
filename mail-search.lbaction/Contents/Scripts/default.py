#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import re
import json
import sys
import glob
import datetime

from emlx import read


def normalize(string):
    return re.sub(r"\W", "", string).lower()


try:
    input_string = sys.argv[1]
except IndexError as e:
    sys.exit()

output = []

messages = os.path.expanduser("~/Library/Mail/V7/")
for folder in glob.glob(messages + "/*"):
    contents = os.listdir(folder)
    if "INBOX.mbox" in contents:
        break

for emlx in glob.glob(os.path.join(folder, "*/*/Data/Messages/*")):
    emlxObj = read(emlx)
    headers = emlxObj.headers
    from_address = headers.get("From", "")
    subject = headers.get("Subject", "")
    to = headers.get("To", "")
    cc1 = headers.get("Cc", "")
    cc2 = headers.get("CC", "")
    search_pool = normalize(from_address + subject + to + cc1 + cc2)
    if input_string in search_pool:
        date = headers["Date"]
        lastColon = date.rfind(":")
        formattedDate = date[0:lastColon + 3].replace(",", "")
        formattedDate = re.sub(r"^[^\d]+", "", formattedDate)
        timestamp = datetime.datetime.strptime(
            formattedDate, "%d %b %Y %H:%M:%S").timestamp()
        msg = {
            "title": subject,
            "subtitle": from_address,
            "date": timestamp,
            "path": emlx,
            "icon": 'font-awesome:fa-envelope'
        }
        output.append(msg)

output = sorted(output, key=lambda d: d["date"], reverse=True)
if len(output) == 0:
    output = [{
        "title": "No messages found",
        "icon": "font-awesome:fa-info-circle"
    }]
print(json.dumps(output))
