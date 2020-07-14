# LaunchBar Actions

A collection of LaunchBar 6 actions.

## To Do

- Replace some of the NodeJS actions with lighter implementations in shell script, Python or Swift, all of which LaunchBar runs natively.

## Notes

- `./shared` contains code used by two or more actions. This folder **HAS** to exist inside `~/Library/Application Support/LaunchBar/Actions/` or the dependents wouldn't work.
- Some actions execute compiled Swift scripts that may require elevated permissions, such as "Full Disk Access" or contacts access. The source code for those scripts can be found in the`./shared` folder. I opt for compiled scripts only when the performance benefits outweigh the overhead.
- Some actions require external programs, such as [NodeJS](https://nodejs.org/en/), [ImageMagick](https://imagemagick.org/), [Pashua](https://github.com/BlueM/Pashua), and more. The actions except those programs to be installed in their default directories.
- Some actions are intented to work with my own [Hammerspoon setup](https://github.com/roeybiran/.hammerspoon). Those are prefixed with `hs`.
