"use strict";

const plist = require("simple-plist");
const { execFile } = require("@roeybiran/task");
const connect = require("./connect");
const lb = require("launchbar-node");

// put your AirPod's name here, each device should have its entry
// if more than 1 device is available, a menu will be shown, allowing the user
// to choose the desired target device

const AIRPODS = ["Roey’s AirPods"];

(async () => {
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
    if (AIRPODS.includes(deviceName)) {
      devicesMenu.push({
        title: deviceName,
        subtitle: deviceAddress,
        actionArgument: deviceAddress,
        action: "choice.sh"
      });
    }
  });
  if (devicesMenu.length > 1) {
    return console.log(JSON.stringify(devicesMenu));
  }

  if (devicesMenu.length === 0) {
    return console.log(
      JSON.stringify([
        {
          title: "Toggle AirPods",
          subtitle: "Could not find any of the specificed devices",
          icon: "font-awesome:fa-info-circle"
        }
      ])
    );
  }
  lb.hide();
  return connect(devicesMenu[0].actionArgument);
})();
