#!/bin/sh
#
# LaunchBar Action Script
#

sqlite3 ~/Library/Messages/chat.db 'SELECT text, date FROM message ORDER BY date DESC' | head -n 1
