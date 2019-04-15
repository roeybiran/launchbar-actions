#!/bin/sh

for f in "${HOME}/.Trash/"*; do
	# date=$(mdls "${f}" | grep "kMDItemFSContentChangeDate")
	# date="${date##*= }"; date="${date%% +*}"
	# echo "${f}"$'\t'"${date}"
	echo "${f}"
done
