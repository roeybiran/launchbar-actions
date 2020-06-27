#!/bin/bash

# /usr/local/bin/node index.js "${@}"

if [[ "${LB_OPTION_LIVE_FEEDBACK}" == "0" ]]; then
	mdfind -onlyin "${1}" "kind:folder OR NOT kind:folder"
fi
mdfind "${1}"



# "use strict";

# const { execFile } = require("@roeybiran/task");

# /*
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

# (async () => {
#   let userInput = process.argv[2] || process.exit();
#   let query = `(kMDItemDisplayName = "*${userInput}*"cd)`;

#   // TODO: support for more advanced of spotlight queries (kinds, dates)
#   if (/t(ext)?:/.test(userInput)) {
#     userInput = userInput.replace(/^t(ext)?:/, "");
#     query = `(kMDItemTextContent = "${userInput}*"cd)`;
#   }

#   try {
#     let output;
#     const { stdout } = await execFile("/usr/bin/mdfind", [query]);
#     if (!stdout) {
#       output = [
#         {
#           title: "No results",
#           subtitle: "Try a different query",
#           icon: "font-awesome:fa-info-circle"
#         }
#       ];
#     } else {
#       output = stdout.split("\n").map(x => ({ path: x }));
#     }
#     return console.log(JSON.stringify(output));
#   } catch (error) {
#     return console.log(error);
#   }
# })();
