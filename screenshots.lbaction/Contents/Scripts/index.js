"use strict";

const path = require("path");

const delayValues = [3, 5, 10];

const now = new Date(Date.now());
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

const options = [
  {
    title: "Capture Selection",
    modifiers: {
      default: { title: "to Clipboard", args: ["-ci"] },
      shift: { title: "to Desktop", args: ["-i", screenshotFile] },
      alt: { title: "to Preview", args: ["-iP", screenshotFile] },
      control: {
        title: "to Annotation/Desktop",
        args: ["-iUu", screenshotFile],
        screenCaptureUI: "Capture Selected Portion"
      }
    }
  },
  {
    title: "Capture Screen",
    modifiers: {
      default: { title: "to Clipboard", args: ["-Sc", screenshotFile] },
      shift: { title: "to Desktop", args: ["-S", screenshotFile] },
      alt: { title: "to Preview", args: ["-SP", screenshotFile] },
      control: {
        title: "to Annotation/Desktop",
        args: ["-iUu", screenshotFile],
        screenCaptureUI: "Capture Entire Screen"
      }
    }
  },
  {
    title: "Record Selection",
    modifiers: {
      default: {
        title: "to Desktop/Annotation",
        args: ["-iUu", screenshotFile],
        screenCaptureUI: "Record Selected Portion"
      }
    }
  },
  {
    title: "Record Screen",
    modifiers: {
      default: {
        title: "to Desktop/Annotation",
        args: ["-iUu", screenshotFile],
        screenCaptureUI: "Record Entire Screen"
      }
    }
  }
];

const modifierSymbols = {
  default: "Default",
  alt: "⌥",
  shift: "⇧",
  command: "⌘",
  control: "⌃"
};

options.map(optionParam => {
  const option = optionParam;
  const subtitle = [];
  Object.keys(option.modifiers).forEach(modifier => {
    subtitle.push(
      `${modifierSymbols[modifier]}: ${option.modifiers[modifier].title}`
    );
  });
  option.subtitle = subtitle.join(", ");
  option.action = "choice.sh";
  option.actionReturnsItems = false;
  option.actionRunsInBackground = true;
  option.icon = "com.apple.screenshot.launcher";
  option.children = delayValues.map(delayValue => {
    return {
      badge: `${delayValue} seconds delay`,
      sleep: delayValue,
      ...option
    };
  });
  return option;
});

console.log(JSON.stringify(options, null, " "));
