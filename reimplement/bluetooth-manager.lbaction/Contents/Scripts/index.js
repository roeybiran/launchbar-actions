"use strict";

const plist = require("simple-plist");
const { execFile } = require("@roeybiran/task");
const config = require("@roeybiran/launchbar-config");

// required json format:
// {
//   "<DEVICE NAME>": "<DEVICE ICON>",
// };
// (icon must be in the action's ./Resources folder)
const DEVICES = config.get("DEVICES");
if (!DEVICES) {
  process.exit(0);
}

(async () => {
  try {
    const { stdout } = await execFile("/usr/sbin/system_profiler", [
      "SPBluetoothDataType",
      "-detailLevel",
      "full",
      "-xml"
    ]);
    const parsedSysProfilerOutput = plist.parse(stdout);
    const topLevelDict = parsedSysProfilerOutput[0];
    const devices = topLevelDict._items[0].device_title;
    const devicesMenu = [];
    devices.forEach(device => {
      const deviceName = Object.keys(device)[0];
      const deviceAddress = device[deviceName].device_addr;
      if (DEVICES[deviceName]) {
        devicesMenu.push({
          title: deviceName,
          subtitle: deviceAddress,
          icon: DEVICES[deviceName],
          actionArgument: deviceAddress,
          actionRunsInBackground: true,
          action: "choice.sh"
        });
      }
    });

    let output;
    if (devicesMenu.length === 0) {
      output = [
        {
          title: "Bluetooth Devices",
          subtitle: "Could not find any of the specificed devices",
          icon: "font-awesome:fa-info-circle"
        }
      ];
    } else {
      output = devicesMenu;
    }
    console.log(JSON.stringify(output));
  } catch (error) {
    console.log(error);
  }
})();
