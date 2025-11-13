#!/usr/bin/python3

# a LaunchBar port of https://github.com/sballin/alfred-search-notes-app/

import sys
import sqlite3
import zlib
import re
import os
import json
import operator

# SHOW_FOLDERS
# SHOW_TRASH_FOLDERS
# SORT_BY="DATE", "TITLE"...
SHOW_DELETED_NOTES = 1
SORTING_KEYS = {
    "note": 3,
    "folder": 2,
    "trash_folder": 1,
    "deleted_note": 0,
}

# Inline helper used in multiple places
normalized_string = lambda s: re.sub(r"\W", "", s).lower()

# Read Notes DB (read-only)
home = os.path.expanduser('~')
db = home + '/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite'
conn = sqlite3.connect('file:' + db + '?mode=ro', uri=True)
c = conn.cursor()

# Fetch UUID for x-coredata URLs
c.execute('SELECT z_uuid FROM z_metadata')
uuid = str(c.fetchone()[0])

# Fetch notes
c.execute("""SELECT c.ztitle1,
                    c.zfolder,
                    c.zmodificationdate1,
                    c.z_pk,
                    n.zdata
                FROM ziccloudsyncingobject AS c
                INNER JOIN zicnotedata AS n
                ON c.znotedata = n.z_pk
                WHERE c.ztitle1 IS NOT NULL AND
                    c.zfolder IS NOT NULL AND
                    c.zmodificationdate1 IS NOT NULL AND
                    c.z_pk IS NOT NULL AND
                    n.zdata IS NOT NULL AND
                    c.zmarkedfordeletion IS NOT 1""")
db_items = c.fetchall()

# Fetch folders
c.execute("""SELECT z_pk, ztitle2
                FROM ziccloudsyncingobject
                WHERE ztitle2 IS NOT NULL AND
                    zmarkedfordeletion IS NOT 1""")
folders = {code: name for code, name in c.fetchall()}

conn.close()

items = []
for _, d in enumerate(db_items):
    title, folder_code, mod_date, note_id, body_data = d
    folder_name = folders[folder_code]
    kind = "note"
    icon = 'font-awesome:fa-sticky-note'

    if folder_name == 'Recently Deleted':
        if SHOW_DELETED_NOTES == 1:
            kind = "deleted_note"
            icon = "font-awesome:fa-trash"
        else:
            continue

    # Extract note body
    try:
        decompressed = zlib.decompress(body_data, 16 + zlib.MAX_WBITS).split(b'\x1a\x10', 1)[0]
        idx = decompressed.index(b'\x08\x00\x10\x00\x1a')
        idx = decompressed.index(b'\x12', idx)
        text_bytes = decompressed[idx + 1:]
        text = text_bytes.decode('utf-8', errors='ignore')
        lines = text.split('\n')
        body = '\n'.join(lines[1:]) if len(lines) > 1 else ''
    except Exception: # encrypted note
        body = ''

    try:
        # Replace any number of newlines with a single space character
        body_preview = ' '.join(body[:100].replace('\n', ' ').split())
    except Exception:
        body_preview = ''

    subtitle = "{} | {}".format(folder_name, body_preview) if body_preview else folder_name
    try:
        # Shortening the note body for a one-line preview can chop two-byte unicode characters in half. Here we fix that.
        tmp = subtitle + '.'
        pos = len(tmp) - 1
        while pos > -1 and ord(tmp[pos]) & 0xC0 == 0x80:
            pos -= 1
        subtitle = tmp[:pos]
    except Exception:
        subtitle = folder_name

    try:
        display_body = [{"title": x} for x in body.split("\n")]
    except Exception:
        display_body = None

    items.append({
        'title': title,
        'subtitle': subtitle,
        'action': "showNote.sh",
        'actionArgument': 'x-coredata://{}/ICNote/p{}'.format(uuid, str(note_id)),
        'icon': icon,
        'actionReturnsItems': False,
        'actionRunsInBackground': True,
        'normalizedBody': normalized_string(body),
        'modDate': mod_date,
        'children': display_body,
        'kind': SORTING_KEYS[kind]
    })

# Add folders to list
for folder_code in folders:
    title = folders[folder_code]
    kind = "trash_folder" if title == 'Recently Deleted' else "folder"
    items.append({
        'title': title,
        'subtitle': "Folder",
        'action': "showNotesFolder.sh",
        'actionArgument': 'x-coredata://{}/ICFolder/p{}'.format(uuid, str(folder_code)),
        'icon': 'font-awesome:fa-folder-o',
        'actionReturnsItems': False,
        'actionRunsInBackground': True,
        'normalizedBody': None,
        'modDate': 0,
        'children': None,
        'kind': SORTING_KEYS[kind]
    })

# Sort: kind then mod date
items = sorted(items, key=operator.itemgetter("kind", "modDate"), reverse=True)

# Optional search filter
if len(sys.argv) > 1:
    search_input = normalized_string(sys.argv[1])
    items = [a for a in items if a["normalizedBody"] and re.search(search_input, a["normalizedBody"])]

print(json.dumps(items, indent=2, ensure_ascii=True))
