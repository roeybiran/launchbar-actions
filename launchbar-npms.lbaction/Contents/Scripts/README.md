# launchbar-npms

> "LaunchBar 6 action to search for npm modules using npms.io"

A port of [alfred-npms](https://github.com/sindresorhus/alfred-npms).

## Installation

Download the latest release and unzip the .lbaction bundle to your ~/Library/Application Support/LaunchBar/Actions/ folder.

## Usage

- Prepend input with `?` to execute arbitrary search in [npmjs.com](https://www.npmjs.com/).
- Quote your input (either with double or single quotes) to boost exact matches.
- While an item is highlighted:
    - Press <kbd>return</kbd> to open its repository. If it doesn't have one, the corresponding npm page will be opened instead.
    - Press <kbd>shift+return</kbd> to open the selected item's npm page anyway.

## Requirements

- NodeJS, installed in `/usr/local/bin/`.

![screenshot](screenshot.png?raw=true)
