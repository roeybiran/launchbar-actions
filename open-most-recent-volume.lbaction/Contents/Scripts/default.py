#!/usr/bin/env python

import plistlib
import subprocess

try:
    disks = plistlib.readPlistFromString(subprocess.check_output(["/usr/sbin/diskutil", "list", "-plist", "external"]))["AllDisksAndPartitions"][-1]
    last_disk = disks["Partitions"][-1]["MountPoint"]
    subprocess.check_output(["/usr/bin/open", last_disk])
except IndexError as err:
    print("no external disks")
