#!/bin/sh

# Metadata queries reflecting Finder search options (Catalina+):

#   Name matches "foo"
#     (kMDItemDisplayName = "foo*"cdw)
#   Name contains "foo"
#     (kMDItemDisplayName = "*foo*"cd)
#   Name begins with "foo"
#     (kMDItemDisplayName = "foo*"cd)

#   Contents contain "foo"
#     (kMDItemTextContent = "foo*"cdw)

#   Kind = Application
#     kMDItemContentTypeTree=com.apple.application
#   Kind = Archive
#     kMDItemContentTypeTree=public.archive
#   Kind = Document
#     kMDItemContentTypeTree = public.content
#   Kind = Executable
#     _kMDItemGroupId = 8
#   Kind = Folder
#     _kMDItemGroupId = 9
#   Kind = Image
#     _kMDItemGroupId = 13
#   Kind = Movie
#     _kMDItemGroupId = 7
#   Kind = Music
#     _kMDItemGroupId = 10
#   Kind = PDF
#     _kMDItemGroupId = 11
#   Kind = Presentation
#     _kMDItemGroupId = 12
#   Kind = Text
#     kMDItemContentTypeTree = public.text
#   Kind = Other: "foo"
#     (((kMDImtemContentTypeTree = "foo*"cdw)) || ((kMDItemKind = "foo*"cdw)))
# */

if [ "${LB_OPTION_LIVE_FEEDBACK}" = "0" ]; then
	mdfind -onlyin "${1}" "kind:folder OR NOT kind:folder"
fi

mdfind "(kMDItemDisplayName = \"*${1}*\"cdw)"
