#!/bin/bash

for f in "${@}"; do
	unzip -l "${f}"
done
