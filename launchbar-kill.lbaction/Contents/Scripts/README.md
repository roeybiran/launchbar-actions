# launchbar-kill

> LaunchBar 6 action to list and kill processes

## Installation

1. Download the latest release.
2. Unzip, and open the .lbaction bundle or put it in the ~/Library/Application Support/LaunchBar/Actions/ folder.

## Usage

- Processes are sroted by a descending CPU usage.
- Press <kbd>return</kbd> on a selected process to send it a `SIGTERM`.
- Pressing <kbd>shift</kbd>+<kbd>return</kbd> on a selected process will kill it, and open it again past 2 seconds. The rationale is to provide a way to force-relaunch processes (specifically, processes that originate in macOS applications).

## Requirements

- NodeJS, installed in `/usr/local/bin/`.

![screenshot](screenshot.png?raw=true)
