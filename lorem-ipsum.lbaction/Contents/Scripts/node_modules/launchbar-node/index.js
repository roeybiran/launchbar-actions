"use strict";

const env = require("@roeybiran/launchbar-env");
const escapeString = require("escape-string-applescript");
const task = require("@roeybiran/task");

const LaunchBar = module.exports;

LaunchBar.env = env;

/**
 * hides LaunchBar.
 */
LaunchBar.hide = async () => {
  try {
    await task.execFile("/usr/bin/osascript", [
      "-e",
      'tell application "LaunchBar" to hide'
    ]);
  } catch (error) {
    throw error;
  }
};

/**
 * keeps LaunchBar active.
 */
LaunchBar.remainActive = async () => {
  try {
    await task.execFile("/usr/bin/osascript", [
      "-e",
      'tell application "LaunchBar" to remain active'
    ]);
  } catch (error) {
    throw error;
  }
};

/**
 * checks whether LB has keyboard focus.
 * @returns {boolean} True if LB has keyboard focus, otherwise false.
 */
LaunchBar.hasKeyboardFocus = async () => {
  try {
    const result = await task.execFile("/usr/bin/osascript", [
      "-e",
      'tell application "LaunchBar" to return has keyboard focus'
    ]);
    return result === "true";
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronously sets the clipboard's contents.
 * @param {string} text the text to copy to the clipboard.
 */
LaunchBar.setClipboardString = async text => {
  try {
    await task.execFile("/usr/bin/osascript", [
      "-e",
      `tell application "LaunchBar" to set the clipboard to "${escapeString(
        text
      )}"`
    ]);
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronously clears the clipboard's contents.
 */
LaunchBar.clearClipboard = async () => {
  try {
    await task.execFile("/usr/bin/osascript", [
      "-e",
      'set the clipboard to ""'
    ]);
  } catch (error) {
    throw error;
  }
};

/**
 * Asynchronously pastes passed text into the frontmost application.
 * @param {string} text the text to paste.
 */
LaunchBar.paste = async text => {
  try {
    await task.execFile("/usr/bin/osascript", [
      "-e",
      `tell application "LaunchBar" to paste in frontmost application "${escapeString(
        text
      )}"`
    ]);
  } catch (error) {
    throw error;
  }
};

/**
 * Perform a macOS service.
 * Available services could be seen in the index.
 * @param {string} service the service to perform.
 * @param {string=} argv service's arguments.
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
 * @param {Object} [options] - the message's options.
 * @param {string} [options.text] - the notification's body.
 * @param {string} [options.title] - the notification's title.
 * @param {string} [options.subtitle] - the notification's subtitle.
 * @param {string} [options.callbackUrl] - URL opened if the user clicks on the notification.
 * @param {number} [options.afterDelay] - Delay in seconds before the notification is shown.
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
 * @param {string} textArguments - the text to process.
 * @param {function} textProcessingFunction - a function to run over each line. Should accept and return single argument -- a line of text.
 * @param {string} joiner - the separator to join back the lines into a string.
 *
 */
LaunchBar.textAction = (
  textArguments,
  textProcessingFunction,
  joiner = "\n"
) => {
  let output = [];
  // If sent arguments are strings, LB will most likely consolidate them into a single string argument
  // however, it is perfectly reasonable to send paths or other "items" to text-processing actions
  // in such cases, arguments are send as a regular array
  if (typeof textArguments === "string") {
    textArguments = [textArguments];
  }
  textArguments.forEach(textItem => {
    const linesOfTextItem = textItem.split("\n");
    linesOfTextItem.forEach(aLine => {
      output.push(textProcessingFunction(aLine));
    });
  });

  output = output.join(joiner);
  if (env.commandKey) {
    return console.log(output);
  }
  return LaunchBar.paste(output);
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
