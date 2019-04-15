#!/bin/sh
#
# Copyright (c) 2016 Objective Development Software GmbH
# https://obdev.at/

# Clear "hidden" flag on every file passed:
for file in "$@"
do
    chflags nohidden "$file"
done
