# Miscellaneous LaunchBar Actions

## Notes

- Actions are provided as-is.
- Actions with a leading underscore are not meant to be run on their own. Rather, they contain code that is shared among other actions. They should be hidden in LaunchBar's index.
- Some actions require additional utilities and/or programs (e.g. Default Folder X, ImageMagick).
- Some actions are intented to work with my own Hammerspoon setup.

## Actions

### launchbar-system-preferences-anchors

List and launch any System Preferences.app anchor.

- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-stats

Display useful information about your machine.

- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-kaomoji

Get relevant kaomojis from text. A port of [alfred-kaomoji](https://github.com/vinkla/alfred-kaomoji).

- Usage
  - Press <kbd>⏎</kbd> to paste the chosen kaomiji into to the frontmost app.
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-kill

List and kill processes.

- Usage
  - Processes are sroted by a descending CPU usage.
  - Press <kbd>return</kbd> on a selected process to send it a `SIGTERM`.
  - Pressing <kbd>shift</kbd>+<kbd>return</kbd> on a selected process will kill it, and open it again past 2 seconds. The rationale is to provide a way to force-relaunch processes (specifically, processes that originate in macOS applications).
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-npms

Search for npm modules using npms.io. A port of [alfred-npms](https://github.com/sindresorhus/alfred-npms).

- Usage
  - Prepend input with `?` to execute arbitrary search in [npmjs.com](https://www.npmjs.com/).
  - Quote your input (either with double or single quotes) to boost exact matches.
  - While an item is highlighted:
  - Press <kbd>return</kbd> to open its repository. If it doesn't have one, the corresponding npm page will be opened instead.
  - Press <kbd>shift+return</kbd> to open the selected item's npm page anyway.
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-eslint-rules

Search the ESLint rules index.

- Usage
  - Press <kbd>⏎</kbd> to open the chosen item's URL in [ESLint.org](https://eslint.org).
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

  ![screenshot](./screenshots/launchbar-eslint-rules.png?raw=true)

### launchbar-recent-trashes

Browse ~/.Trash by a reversed chronological order of deletion.

- Usage
  - Press <kbd>shift</kbd>+<kbd>return</kbd> to open the trash in Finder.
  - Initial usage might take a while, especially if the trash contains many items. Afterwards, deletion dates will be cached.
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

  ![screenshot](./screenshots/launchbar-recent-trashes.png?raw=true)

### launchbar-recent-downloads

Browse ~/Downloads, showing most recent downloads first.

- Usage
  - Invoke the action with <kbd>shift</kbd>+<kbd>return</kbd> to open the most recently download item in its default app.
  - Invoke the action with <kbd>cmd</kbd>+<kbd>return</kbd> to open ~/Downloads.
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### launchbar-github-search

Search for GitHub repositories or users.

- Usage
  - Prepend input with `usr:` (e.g. `usr:foo`) to search for a user instead of a repository.
- Requirements
  - NodeJS, installed in `/usr/local/bin/`.

### \_finder-copy-window

### \_itunes-like-dislike

### 1password-show

Shows the 1Password7 mini window. Pass an optional string to perform an inital search.

### airdrop-discovery

Show either of the AirDrop discovery states, choose one to launch GUI script that will apply that settings.

### amphetamine-control

Toggle Amphetamine indefinitely, or activate it for a set amount of time using natural language input.

### archives-browse-in-betterzip

Browse an archive in BetterZip instead of directly extracting it.

### archives-compress-individually

Create individual .zip archives from a set of files.

### box-dimensions-converter

### browse-folder-contents

### cardhop-launcher

Activating Cardhop by clicking its icon simply starts it in the background. This action makes sure to make it visible, with the input bar focused.

### convert-clipboard-objects-to-paths

### copy-image-to-clipboard

### copy-text-file-contents

### create-dummy-files

### date-time-attributes-copy-from

### date-time-attributes-set

### debug-in-script-debugger

### dropbox-menubar

### edit-default-script

### emoji-and-symbols-close-window

### facetime-keypad

### fantastical-2-launcher

Activating Fantastical 2 by clicking its icon simply starts it in the background. This action makes sure to make it visible, with the input bar focused.

### files-chmodx

### files-hide

### files-remove-from-quarantine

### files-unhide

### finder-copy-window-conflict-replace

### finder-copy-window-conflict-skip

### finder-copy-window-conflict-stop

### finder-copy-window-continue

### finder-copy-window-copy-conflict-keep-both

### finder-copy-window-ok

### finder-copy-window-stop-progress

### finder-trash-window-ok

### finder-windows

### force-paste

### handbrake-cli

### hs-brightness-control

### hs-cheatsheet

### hs-force-abc

### hs-volume-control

### itunes-dislike-current-track

### itunes-like-current-track

### launchbar-apps-quit-all-others

### launchbar-apps-quit-all

### launchbar-apps-restart-current-app

### launchbar-browse-current-folder

### launchbar-copy-hfs-path

### launchbar-dfx-get-selection

### launchbar-dfx-save-name

### launchbar-eject-and-trash

### launchbar-get-bundle-id

### launchbar-lorem-ipsum

### launchbar-new-file-here

### launchbar-pdfs-merge

### launchbar-show-index

### launchbar-show-item-in-index

### launchbar-text-dumbify-quotes

### launchbar-text-lower-camel-case

### launchbar-text-lowercase

### launchbar-text-remove-blank-lines

### launchbar-text-remove-duplicate-lines

### launchbar-text-screaming-snake-case

### launchbar-text-smartify-quotes

### launchbar-text-snake-case

### launchbar-text-spinal-case

### launchbar-text-tildify

### launchbar-text-title-case

### launchbar-text-train-case

### launchbar-text-untildify

### launchbar-text-upper-camel-case

### launchbar-text-uppercase

### launchbar-text-wrap-lines-with

### launchbar-text-wrap-words-with

### launchbar-traverse-up

### launchbar-update-index

### network-restart

### network-toggle

### new-mail-message

### new-safari-private-window

### notes-make-new-note

### open-computer

### open-most-recent-volume

### power-restart-reopening-windows

### power-restart

### power-shut-down

### prepend-text-to-clipboard

### print-save-as-pdf-to-desktop

### restart-launchbar

### scan-documents

### search-google-maps-directions

### set-spotlight-comments

### show-desktop

### status-bar

### system-preferences-keyboard-shortcuts-app-shortcuts

### system-preferences-keyboard-shortcuts-services

### tags-add-custom-tag

### tags-replace-with

### text-style-coding

### traverse-down

### wifi-password
