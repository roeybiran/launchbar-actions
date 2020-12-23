function makeNote(noteObj) {
  LaunchBar.hide();
  const { noteBody, noteTitle } = noteObj;
  const newNoteID = LaunchBar.execute(
    "/usr/bin/osascript",
    "-e",
    "on run argv",
    "-e",
    "set noteTitle to item 1 of argv",
    "-e",
    "set noteBody to item 2 of argv",
    "-e",
    'tell application "Notes" to set theNote to make new note with properties {name:noteTitle, body:noteBody}',
    "-e",
    "return id of theNote",
    "-e",
    "end run",
    noteTitle,
    noteBody
  );

  const arg = encodeURIComponent(
    `-e 'tell app "Notes" to show note id "${newNoteID}"'`
  );
  LaunchBar.displayNotification({
    string: `title: ”${noteTitle}”, body: ”${noteBody}”`,
    subtitle: "Successfully created new note",
    url: `x-launchbar:execute?path=/usr/bin/osascript&arguments=${arg}` // does not work, and hard to debug
  });
}

function runWithString(theString) {
  if (!theString) return;

  const args = theString
    .split("|")
    .filter(x => x)
    .map(x => x.trim());

  let noteTitle = "Untitled Note";
  let noteBody;
  if (args.length === 2) {
    noteTitle = args[0];
    noteBody = args[1];
  } else {
    noteBody = args[0];
  }

  return [
    {
      title: noteTitle,
      subtitle: noteBody,
      action: "makeNote",
      actionRunInBackground: true,
      actionReturnsItems: false,
      icon: "com.apple.Notes",
      noteBody,
      noteTitle
    }
  ];
}
