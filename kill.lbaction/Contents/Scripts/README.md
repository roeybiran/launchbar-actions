# kill

List and kill processes.

## Usage

- Processes are sroted by a descending CPU usage.
- Press <kbd>return</kbd> on a selected process to send it a `SIGTERM`.
- Pressing <kbd>shift</kbd>+<kbd>return</kbd> on a selected process will kill it, and open it again past 2 seconds. The rationale is to provide a way to force-relaunch processes (specifically, processes that originate in macOS applications).

## Requirements

- NodeJS, installed in `/usr/local/bin/`.
