# notes-search

Search Notes.app. A port of [alfred-search-notes-app](https://github.com/sballin/alfred-search-notes-app).

## Usage

- Select an item to open it in Notes.app.
- Run the action with `return` to filter notes by title.
- Run the action with `space` and type a search term to show notes containing that term.
- By default, most recently modified notes are shown first. Set the `SORT_ID` variable at the top of the default script to `0` to sort alphabetically.
- Sorting order is reversed by default. Set the `SORT_REVERSE` variable to `False` to change this.
- By default, deleted notes are shown, and included when searching for contained text. Set `SHOW_TRASHED` variable to `False` to change this.
