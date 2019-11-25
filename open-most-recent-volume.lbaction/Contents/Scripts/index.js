"use strict";

const lb = require("launchbar-node");
const { parse } = require("simple-plist");
const { execFile } = require("@roeybiran/task");

// TODO: MODULIZE
/**
 * @param {Object} options
 * @param {string} options.title
 * @param {string=} options.subtitle
 */
const errorMessage = options => {
  // https://www.obdev.at/resources/launchbar/help/
  return {
    title: options.title,
    subtitle: options.subtitle || undefined,
    icon: "font-awesome:warning"
  };
};

(async () => {
  const { stdout } = await execFile("/usr/sbin/diskutil", [
    "list",
    "-plist",
    "external"
  ]);
  const data = parse(stdout);
  if (data.AllDisksAndPartitions.length === 0) {
    console.log(
      JSON.stringify([errorMessage({ title: "No mounted volumes" })])
    );
    process.exit();
  }

  const { AllDisksAndPartitions } = data;
  const { Partitions } = AllDisksAndPartitions[
    AllDisksAndPartitions.length - 1
  ];
  const { MountPoint } = Partitions[Partitions.length - 1];

  if (lb.env.spaceKey) {
    console.log(JSON.stringify([{ path: MountPoint }]));
    process.exit();
  }
  await execFile("/usr/bin/open", [MountPoint]);
  await lb.hide();
})();
