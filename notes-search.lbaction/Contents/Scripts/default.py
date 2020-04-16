#!/usr/bin/env python3

import sys
import sqlite3
import zlib
import re
import os
import json
import operator

# a LaunchBar port of https://github.com/sballin/alfred-search-notes-app/
SORTING_KEYS = {
    "note": 3,
    "folder": 2,
    "trash_folder": 1,
    "deleted_note": 0,
}


def normalizedString(string):
    return re.sub(r"\W", "", string).lower()


def extractNoteBody(data):
    # Decompress
    try:
        data = zlib.decompress(data,
                               16 + zlib.MAX_WBITS).split(b'\x1a\x10', 1)[0]
    except zlib.error as e:
        return 'Encrypted note'
    # Find magic hex and remove it
    # Source: https://github.com/threeplanetssoftware/apple_cloud_notes_parser
    index = data.index(b'\x08\x00\x10\x00\x1a')
    index = data.index(b'\x12', index)  # starting from index found previously
    # Read from the next byte after magic index
    data = data[index + 1:]
    # Convert from bytes object to string
    text = data.decode('utf-8', errors='ignore')
    # Remove title
    lines = text.split('\n')
    if len(lines) > 1:
        return '\n'.join(lines[1:])
    else:
        return ''


def fixStringEnds(text):
    """
    Shortening the note body for a one-line preview can chop two-byte unicode
    characters in half. This method fixes that.
    """
    # This method can chop off the last character of a short note, so add a dummy
    text = text + '.'
    # Source: https://stackoverflow.com/a/30487177
    pos = len(text) - 1
    while pos > -1 and ord(text[pos]) & 0xC0 == 0x80:
        # Character at pos is a continuation byte (bit 7 set, bit 6 not)
        pos -= 1
    return text[:pos]


def newlinesToSpace(text):
    """
    Replace any number of newlines with a single space character.
    """
    return ' '.join(text.replace('\n', ' ').split())


def readDatabase():
    # Open notes database read-only
    home = os.path.expanduser('~')
    db = home + '/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite'
    conn = sqlite3.connect('file:' + db + '?mode=ro', uri=True)
    c = conn.cursor()

    # Get uuid string required in x-coredata URL
    c.execute('SELECT z_uuid FROM z_metadata')
    uuid = str(c.fetchone()[0])

    # Get note rows
    c.execute("""SELECT c.ztitle1,            -- note title (str)
                        c.zfolder,            -- folder code (int)
                        c.zmodificationdate1, -- modification date (float)
                        c.z_pk,               -- note id for x-coredata URL (int)
                        n.zdata               -- note body text (str)
                 FROM ziccloudsyncingobject AS c
                 INNER JOIN zicnotedata AS n
                 ON c.znotedata = n.z_pk -- note id (int) distinct from x-coredata one
                 WHERE c.ztitle1 IS NOT NULL AND
                       c.zfolder IS NOT NULL AND
                       c.zmodificationdate1 IS NOT NULL AND
                       c.z_pk IS NOT NULL AND
                       n.zdata IS NOT NULL AND
                       c.zmarkedfordeletion IS NOT 1""")
    dbItems = c.fetchall()

    # Get folder rows
    c.execute("""SELECT z_pk,   -- folder code
                        ztitle2 -- folder name
                 FROM ziccloudsyncingobject
                 WHERE ztitle2 IS NOT NULL AND
                       zmarkedfordeletion IS NOT 1""")
    folders = {code: name for code, name in c.fetchall()}

    conn.close()
    return uuid, dbItems, folders


def getNotes():
    # Read Notes database and get contents
    uuid, dbItems, folders = readDatabase()

    items = []

    for i, d in enumerate(dbItems):
        title, folderCode, modDate, noteId, bodyData = d
        folderName = folders[folderCode]
        modDate = modDate
        kind = "note"
        icon = 'font-awesome:fa-sticky-note'
        if folderName == 'Recently Deleted':
            if SHOW_DELETED_NOTES == 1:
                kind = "deleted_note"
                icon = "font-awesome:fa-trash"
            else:
                continue

        try:
            body = extractNoteBody(bodyData)
        except:
            body = ''

        try:
            # Replace any number of \ns with a single space for note body preview
            bodyPreview = newlinesToSpace(body[:100])
        except:
            bodyPreview = ''

        if bodyPreview:
            subtitle = folderName + ' | ' + bodyPreview
        else:
            subtitle = folderName

        try:
            subtitle = fixStringEnds(subtitle)
        except:
            subtitle = folderName

        try:
            # displayBody = map(lambda x: {"title": x}, body.split("\n"))
            displayBody = [{"title": x} for x in body.split("\n")]
        except:
            displayBody = None

        note = {
            'title':
            title,
            'subtitle':
            subtitle,
            'action':
            "showNote.sh",
            'actionArgument':
            'x-coredata://{}/ICNote/p{}'.format(uuid, str(noteId)),
            'icon':
            icon,
            'actionReturnsItems':
            False,
            'actionRunsInBackground':
            True,
            'normalizedBody':
            normalizedString(body),
            'modDate':
            modDate,
            'children':
            displayBody,
            'kind':
            SORTING_KEYS[kind]
        }
        items.append(note)

    for folderCode in folders:
        title = folders[folderCode]
        kind = "folder"
        if title == 'Recently Deleted':
            kind = "trash_folder"
        folder = {
            'title':
            title,
            'subtitle':
            "Folder",
            'action':
            "showNotesFolder.sh",
            'actionArgument':
            'x-coredata://{}/ICFolder/p{}'.format(uuid, str(folderCode)),
            'icon':
            'font-awesome:fa-folder-o',
            'actionReturnsItems':
            False,
            'actionRunsInBackground':
            True,
            'normalizedBody':
            None,
            'modDate':
            0,
            'children':
            None,
            'kind':
            SORTING_KEYS[kind]
        }
        items.append(folder)

    return items


if __name__ == '__main__':
    SORT_BY_DATE = 1
    SHOW_DELETED_NOTES = 1
    # SHOW_FOLDERS
    # SHOW_TRASH_FOLDERS
    # SORT_BY_TITLE
    items = getNotes()
    # items = sorted(items, key=lambda d: d['modDate'], reverse=True)
    items = sorted(items,
                   key=operator.itemgetter("kind", "modDate"),
                   reverse=True)

    if len(sys.argv) > 1:
        input = normalizedString(sys.argv[1])
        items = [
            a for a in items
            if a["normalizedBody"] and re.search(input, a["normalizedBody"])
        ]

    print(json.dumps(items, indent=2, ensure_ascii=True))

    # if spacebar is pressed, action enters live feedback mode, and the user has typed something:
    # don't show folders and match input against note bodies
