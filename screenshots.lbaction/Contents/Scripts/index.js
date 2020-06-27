"use strict";

const path = require("path");

const delayValues = [3, 5, 10];

const now = new Date();
const dateComponenets = [
  now.getFullYear(),
  now.getMonth() + 1,
  now.getDate(),
  now.getHours(),
  now.getMinutes(),
  now.getSeconds()
];

const screenshotFile = path.join(
  process.env.HOME,
  "Desktop",
  `screencapture_${dateComponenets.join("-")}.png`
);

const tempFile = path.join(process.env.TMPDIR, `${now.getTime()}.png`);

const options = [
  { title: "Capture Selection to Clipboard", args: ["-ci"] },
  { title: "Capture Selection to Desktop", args: ["-i", screenshotFile] },
  { title: "Capture Selection to Preview", args: ["-iP", screenshotFile] },
  {
    title: "Capture Selection to Desktop & Annotate",
    args: ["-iUu", screenshotFile],
    screenCaptureUI: "Capture Selected Portion"
  },
  { title: "Capture Selection to Imgur", args: ["-i", tempFile], imgur: true },
  { title: "Capture Screen to Clipboard", args: ["-Sc", screenshotFile] },
  { title: "Capture Screen to Desktop", args: ["-S", screenshotFile] },
  { title: "Capture Screen to Preview", args: ["-SP", screenshotFile] },
  {
    title: "Capture Screen to Desktop & Annotate",
    args: ["-iUu", screenshotFile],
    screenCaptureUI: "Capture Entire Screen"
  },
  { title: "Capture Screen to Imgur", args: ["-S", tempFile], imgur: true },
  {
    title: "Record Selection to Desktop & Annotate",
    args: ["-iUu", screenshotFile],
    screenCaptureUI: "Record Selected Portion"
  },
  {
    title: "Record Screen to Desktop & Annotate",
    args: ["-iUu", screenshotFile],
    screenCaptureUI: "Record Entire Screen"
  }
].map(option => {
  const modifiedOption = option;
  modifiedOption.actionRunsInBackground = true;
  modifiedOption.actionReturnsItems = false;
  modifiedOption.icon = option.title.startsWith("Capture")
    ? "font-awesome:fa-camera"
    : "font-awesome:fa-video-camera";
  modifiedOption.action = "choice.sh";
  modifiedOption.children = delayValues.map(delayValue => {
    return {
      ...modifiedOption,
      badge: `${delayValue} seconds delay`,
      delayValue
    };
  });
  return modifiedOption;
});

console.log(JSON.stringify(options, null, " "));
