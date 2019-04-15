#!/bin/bash
#
# LaunchBar Action Script
#


CLIENTID=$(osascript -e 'tell application "Safari" to tell window 1 to return URL of current tab' | perl -ne '/id=(\d+)/ && print "$1\n";' )

osascript <<EOD
tell application "Safari"
  activate
  tell window 1
    set URL of current tab to "https://app.icount.co.il/hash/create_doc.php?doctype=invrec&client_id=$CLIENTID"
  end tell
end tell
EOD