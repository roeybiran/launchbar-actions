"use strict";

const path = require("path");
const { execFile } = require("@roeybiran/task");

const runApplescript = async (...args) => {
  const { stdout } = await execFile("/usr/bin/osascript", args);
  return stdout;
};

const scriptsFolder = path.join(__dirname, "bin");
const dfx = module.exports;

/**
 * @returns {String} - the path to the folder shown in an open file dialog.
 */
dfx.getCurrentFolder = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getCurrentFolder.jxa")
  );
  return result;
};

/**
 * @returns {String[]} - the selection in an open file dialog as a list of one or more files.
 */
dfx.getCurrentSelectionList = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getCurrentSelectionList.jxa")
  );
  return result ? result.split("\n") : [];
};

/**
 * @returns {String[]} - the recent Finder windows list.
 */
dfx.getRecentFinderWindows = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getRecentFinderWindows.jxa")
  );
  return result.split("\n");
};

/**
 * @returns {String[]} - the recent files list.
 */
dfx.getRecentFiles = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getRecentFiles.jxa")
  );
  return result.split("\n");
};

/**
 * @returns {String[]} - the recent folders list.
 */
dfx.getRecentFolders = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getRecentFolders.jxa")
  );
  return result.split("\n");
};

/**
 * @returns {String} - the editable file name in a save dialog.
 */
dfx.getSaveName = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "getSaveName.scpt")
  );
  return result;
};

/**
 * set the editable file name in a Save dialog
 * @param {String} saveName - the desired name.
 */
dfx.setSaveName = async saveName => {
  await runApplescript(path.join(scriptsFolder, "setSaveName.scpt"), saveName);
};

/**
 * switch to a different folder in an open file dialog
 * @param {String} targetFolder - the folder to switch to.
 */
dfx.switchToFolder = async targetFolder => {
  const script = path.join(scriptsFolder, "switchToFolder.scpt");
  await runApplescript(script, targetFolder);
};

/**
 * Check if a file dialog is open.
 * @returns {Boolean} - true if a dialog's open, otherwise false.
 */
dfx.isDialogOpen = async () => {
  const result = await runApplescript(
    path.join(scriptsFolder, "isDialogOpen.scpt")
  );
  return result === "true";
};
