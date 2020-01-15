#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import sqlite3
import zlib
import re
import os
import json

SHOW_TRASHED = True
SORT_ID = 2
SORT_REVERSE = SORT_ID == 2

output = []

try:
    # Read Notes database and get contents
    # Open notes database
    databaseConnection = sqlite3.connect(
        os.path.expanduser(
            "~/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite"
        )
    )
    cursor = databaseConnection.cursor()

    # Get uuid string required in full id
    cursor.execute("SELECT z_uuid FROM z_metadata")
    uuid = str(cursor.fetchone()[0])

    # Get tuples of note title, folder code, modification date, & id#
    cursor.execute(
        """SELECT t1.ztitle1,
                    t1.zfolder,
                    t1.zmodificationdate1,
                    t1.z_pk,
                    t1.znotedata,
                    t2.zdata,
                    t2.z_pk
                    FROM ziccloudsyncingobject AS t1
                    INNER JOIN zicnotedata AS t2
                    ON t1.znotedata = t2.z_pk
                    WHERE t1.ztitle1 IS NOT NULL
                    AND t1.zmarkedfordeletion IS NOT 1"""
    )

    # Get data and check for d[5] because a New Note with no body can trip us up
    allNotes = [noteData for noteData in cursor.fetchall() if noteData[5]]
    allNotes = sorted(allNotes, key=lambda d: d[SORT_ID], reverse=SORT_REVERSE)

    # Get ordered lists of folder codes and folder names
    cursor.execute(
        """SELECT z_pk,ztitle2 FROM ziccloudsyncingobject
                    WHERE ztitle2 IS NOT NULL
                    AND zmarkedfordeletion IS NOT 1"""
    )
    folderCodes, folderNames = zip(*cursor.fetchall())
    databaseConnection.close()
except Exception as e:
    print "Database problem: {}".format(e)
    sys.exit()

deletedNotes = []

# getting the notes
for d in allNotes:
    try:
        containingFolder = folderNames[folderCodes.index(d[1])]
        noteTitle = d[0]
        normalizedTitle = re.sub(r"\W", "", noteTitle.encode(encoding="utf-8")).lower()
        # getting the note's body
        try:
            noteBodyData = d[5]
            # Strip weird characters, title & weird header artifacts,
            # and replace line breaks with spaces
            noteBodyData = zlib.decompress(noteBodyData, 16 + zlib.MAX_WBITS).split(
                "\x1a\x10", 1
            )[0]
            # Reference: https://github.com/threeplanetssoftware/apple_cloud_notes_parser
            # Find magic hex and remove it
            index = noteBodyData.index("\x08\x00\x10\x00\x1a")
            index = noteBodyData.index("\x12", index)
            # Read from the next byte after magic index
            noteBodyData = noteBodyData[index + 1 :]
            noteBodyData = unicode(noteBodyData, "utf8", errors="ignore")
            bodyWithNewslines = noteBodyData
            body = re.sub("^.*\n|\n", " ", noteBodyData)
            normalizedBody = re.sub(r"\W", "", body.encode(encoding="utf-8")).lower()
        except Exception as e:
            (
                body,
                bodyWithNewslines,
                normalizedBody,
            ) = "Note body could not be extracted: {}".format(e)

        subtitle = containingFolder
        noteObject = {
            "title": noteTitle,
            "normalizedTitle": normalizedTitle,
            "subtitle": subtitle,
            "action": "showNote.sh",
            "actionArgument": "x-coredata://" + uuid + "/ICNote/p" + str(d[3]),
            "body": normalizedBody,
            "children": map(lambda x: {"title": x}, bodyWithNewslines.split("\n")),
            "icon": "font-awesome:fa-sticky-note",
            "actionReturnsItems": False,
            "actionRunsInBackground": False,
        }

        if containingFolder == "Recently Deleted":
            noteObject["icon"] = "font-awesome:fa-trash-o"
            deletedNotes.append(noteObject)
        else:
            output.append(noteObject)

    except Exception as e:
        output.append(
            {"title": "Error getting note, name: {}".format(d[0]), "subtitle": str(e)}
        )

foldersList = []

# getting the folders
for index, name in enumerate(folderNames):
    folderObject = {
        "title": name,
        "subtitle": "Notes Folder",
        "action": "showNotesFolder.sh",
        "actionArgument": "x-coredata://"
        + uuid
        + "/ICFolder/p"
        + str(folderCodes[index]),
        "icon": "font-awesome:fa-folder-o",
        "actionReturnsItems": False,
        "actionRunsInBackground": True,
    }
    if name.encode(encoding="UTF-8") == "Recently Deleted":
        trashFolder = folderObject
    else:
        foldersList.append(folderObject)
# make sure the trash folder is at the end of the folders list
foldersList.append(trashFolder)

if not SHOW_TRASHED:
    deletedNotes = []

# if spacebar is pressed, action enters live feedback mode, and there's input:
# don't show folders and match input against note bodies
if len(sys.argv) > 1:
    output = output + deletedNotes
    lbInput = re.sub(r"\W", "", sys.argv[1]).lower()
    output = [a for a in output if re.search(lbInput, a["body"])]
else:
    # show folders
    output = output + foldersList + deletedNotes

print (json.dumps(output, indent=2))
