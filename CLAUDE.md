# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a collection of LaunchBar 6 actions organized as individual `.lbaction` bundles. LaunchBar is a macOS productivity application, and these actions extend its functionality through custom scripts.

## Architecture

### Directory Structure
- Each action is a self-contained bundle in a `.lbaction` directory
- Standard bundle structure: `ActionName.lbaction/Contents/`
  - `Info.plist`: Action metadata and configuration
  - `Scripts/`: Contains the executable script(s)
  - `Resources/`: Optional icons and assets

### Script Types
Actions use various script languages:
- **Swift**: Native macOS API integration (e.g., `dictionary-search`, `apps-quit-all`)
- **JavaScript**: LaunchBar's built-in API (e.g., `kill-process`, `recent-downloads`)
- **Python**: Complex data processing (e.g., `notes-search`)
- **Shell/Bash**: System commands (e.g., `network-restart`, `files-chmodx`)
- **AppleScript**: macOS automation (e.g., `clear-notifications`, `force-paste`)

### LaunchBar JavaScript API
JavaScript actions use LaunchBar's built-in API:
- `LaunchBar.execute()`: Run system commands
- `LaunchBar.openURL()`: Open URLs
- `File.displayName()`: Get file display names
- Actions return JSON arrays for LaunchBar to display

### Action Entry Points
- Primary script specified in `Info.plist` under `LBScripts/LBDefaultScript/LBScriptName`
- Scripts must be executable (chmod +x)
- Scripts receive arguments via command line (CommandLine.arguments in Swift, sys.argv in Python, etc.)

## Key Implementation Patterns

### Result Format
Actions return JSON arrays with objects containing:
- `title`: Main display text
- `subtitle`: Secondary information
- `icon`: App bundle ID or font-awesome icon
- `action`: Callback function or script
- `actionArgument`: Data passed to action
- `badge`: Additional info (like CPU usage)

### Background Execution
Actions can run in background (`LBRunInBackground: true` in Info.plist) to avoid blocking UI.

### Workflow Integration
Some actions use macOS Automator workflows (`.workflow` bundles) for complex operations like PDF manipulation.

## Installation

Actions should be placed in: `~/Library/Application Support/LaunchBar/Actions/`

Most actions are dependency-free and work immediately after copying to the actions directory.