#!/bin/bash

destination_parent_folder=$(
	osascript <<-EOF
		set destinationParentFolder to choose folder with prompt ¬
		"Choose Destination" default location (path to desktop folder) ¬
		invisibles true ¬
		multiple selections allowed false ¬
		with showing package contents
		set destinationParentFolder to POSIX path of (destinationParentFolder)
	EOF
)

if [[ $? -ne 0 ]]; then
	exit 0
fi

destination_parent_folder="${destination_parent_folder}/EXTRACTED_FILES"
