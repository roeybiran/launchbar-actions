#!/bin/bash

DB="$HOME/Library/Group Containers/group.com.apple.notes/NoteStore.sqlite"

# uuid
UUID="$(/usr/bin/sqlite3 "$DB" "SELECT z_uuid FROM z_metadata LIMIT 1;")"

# note rows (title, folder, modificationdate, pk, data)
# WARNING: n.zdata is a blob; this returns raw bytes, not decompressed text.
# Fields are TAB-separated per row.
# DB_ITEMS=()
notes="$(/usr/bin/sqlite3 "$DB" "
    SELECT c.ztitle1,            -- note title (str)
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
          c.zmarkedfordeletion IS NOT 1
")"

folders="$(/usr/bin/sqlite3 "$DB" "
SELECT z_pk,   -- folder code
       ztitle2 -- folder name
FROM ziccloudsyncingobject
WHERE ztitle2 IS NOT NULL AND
      zmarkedfordeletion IS NOT 1
")"

echo "$notes"
echo "$folders"

# folders map: z_pk -> ztitle2
# zsh associative array
# typeset -A FOLDERS
# while IFS=$'\t' read -r code name; do
#   [[ -n "$code" ]] && FOLDERS["$code"]="$name"
# done < <(
#   /usr/bin/sqlite3 -separator $'\t' "$DB" "
#     SELECT z_pk, ztitle2
#       FROM ziccloudsyncingobject
#      WHERE ztitle2 IS NOT NULL AND
#            zmarkedfordeletion IS NOT 1;
#   "
# )

# Example usage:
# echo "$UUID"
# print -l -- "${DB_ITEMS[@]}"
# for k in "${(@k)FOLDERS}"; do echo "$k -> ${FOLDERS[$k]}"; done
