#!/bin/sh
#
# Copyright (c) 2016 Objective Development Software GmbH
# https://obdev.at/

# Set "hidden" flag on every file passed:
for file in "$@"
do
    chflags hidden "$file"
done
