#!/usr/bin/env python
#
# LaunchBar Action Script
#

import subprocess
import os
import PyPDF2
import sys


try:

    merger = PyPDF2.PdfFileMerger()
    files = sys.argv[1:]
    firstFile = files[0]
    destinationDir = os.path.dirname(firstFile)

    for f in files:
        f = open(f, "rb")
        merger.append(f)

    firstFileNameNoExt = os.path.splitext(os.path.basename(firstFile))[0]
    outputFileName = '{} and {} others.pdf'.format(firstFileNameNoExt, (len(files) - 1))
    mergedFile = open(destinationDir + "/" + outputFileName, "wb")
    merger.write(mergedFile)

except Exception as e:
    print(e)
