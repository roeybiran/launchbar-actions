"use strict";

const env = require("@roeybiran/launchbar-env");
const escapeString = require("escape-string-applescript");
const task = require("@roeybiran/task");

const LaunchBar = module.exports;

LaunchBar.env = env;

/**
 * output data to LaunchBar.
 */
LaunchBar.output = data => {
  console.log(JSON.stringify(data));
};

/**
 * hides LaunchBar.
 */
LaunchBar.hide = async () => {
  await task.execFile("/usr/bin/osascript", [
    "-e",
    'tell application "LaunchBar" to hide'
  ]);
};

/**
 * keeps LaunchBar active.
 */
LaunchBar.remainActive = async () => {
  await task.execFile("/usr/bin/osascript", [
    "-e",
    'tell application "LaunchBar" to remain active'
  ]);
};

/**
 * @returns {Boolean} true if LaunchBar has keyboard focus, otherwise false.
 */
LaunchBar.hasKeyboardFocus = async () => {
  const result = await task.execFile("/usr/bin/osascript", [
    "-e",
    'tell application "LaunchBar" to return has keyboard focus'
  ]);
  return result === "true";
};

/**
 * sets the clipboard's contents.
 * @param {String} text - the text to copy to the clipboard.
 */
LaunchBar.setClipboardString = async text => {
  await task.execFile("/usr/bin/osascript", [
    "-e",
    `tell application "LaunchBar" to set the clipboard to "${escapeString(
      text
    )}"`
  ]);
};

/**
 * Clears the clipboard's contents.
 */
LaunchBar.clearClipboard = async () => {
  await task.execFile("/usr/bin/osascript", ["-e", 'set the clipboard to ""']);
};

/**
 * Paste text in the frontmost application.
 * @param {String} text - the text to paste.
 */
LaunchBar.paste = async text => {
  await task.execFile("/usr/bin/osascript", [
    "-e",
    `tell application "LaunchBar" to paste in frontmost application "${escapeString(
      text
    )}"`
  ]);
};

/**
 * Perform a macOS service (as seen System Preferences > Keyboard > Shortcuts).
 * @param {String} service - the service to perform.
 * @param {String=} argv - optional arguments to the service.
 */
LaunchBar.performService = async (service, argv) => {
  await task.execFile("/usr/bin/osascript", [
    "-e",
    `tell application "LaunchBar" to perform service "${service}" with string "${escapeString(
      argv
    )}"`
  ]);
};

/**
 * Displays a message in Notification Center.
 * @param {Object} [options]
 * @param {String} [options.text] - the notification's body.
 * @param {String} [options.title] - the notification's title.
 * @param {String} [options.subtitle] - the notification's subtitle.
 * @param {String} [options.callbackUrl] - URL opened if the user clicks on the notification.
 * @param {Number} [options.afterDelay] - Delay in seconds before the notification is shown.
 */
LaunchBar.displayNotification = async options => {
  let text = "";
  let subtitle = "";
  let callbackUrl = "";
  let afterDelay = 0;
  let title = "";

  if (options) {
    title = options.title;
    text = options.text || "";
    subtitle = options.subtitle || "";
    callbackUrl = options.callbackUrl || "";
    afterDelay = options.afterDelay || 0;
  }

  await task.execFile("/usr/bin/osascript", [
    "-e",
    `tell application "LaunchBar" to display in notification center "${text}" ¬
		with title "${title}" ¬
		subtitle "${subtitle}" ¬
		callback URL "${callbackUrl}" ¬
		after delay "${afterDelay}"`
  ]);
};

/**
 * Boilerplate function for text-processing actions.
 * @param {(String|Array)} text - a single string or an array of strings.
 * @param {Function} textProcessingFunction - a function to run over each line. Should accept and return single argument -- a line of text.
 * @param {String} joiner - the separator to join back the lines into a string.
 */
// If sent arguments are strings, LB will most likely consolidate them into a single string argument
// however, it is perfectly reasonable to send paths or other "items" to text-processing actions
// in such cases, arguments are sent as a regular array
LaunchBar.textAction = (
  textArguments,
  textProcessingFunction,
  joiner = "\n"
) => {
  let inputText = textArguments;
  if (typeof inputText === "string") {
    inputText = [inputText];
  }
  const allLines = inputText
    .map(textArgumnet => {
      return textArgumnet.split("\n").map(line => {
        return textProcessingFunction(line);
      });
    })
    .flat();

  if (env.commandKey) {
    return console.log(
      JSON.stringify(
        allLines.map(x => {
          return { title: x };
        })
      )
    );
  }
  return LaunchBar.paste(allLines.join(joiner));
};

// TODO:
// an action.item object?
// caching for live feedback actions
// query
// chosenItem
// allItems
// title
// subtitle
// url
// path
// icon
// iconFont
// iconIsTemplate
// quickLookURL
// action
// actionReturnsItems
// actionRunsInBackground
// actionBundleIdentifier
// eschew this?
// actionArgument
// children
