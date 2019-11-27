"use strict";

const psList = require("ps-list");
const getIcon = require("@roeybiran/app-icon");
const cache = require("@roeybiran/launchbar-cache");

const sortByCpuUsageDescending = (a, b) => {
  const x = a.cpu;
  const y = b.cpu;
  if (x > y) {
    return -1;
  }
  if (x < y) {
    return 1;
  }

  return 0;
};

(async () => {
  try {
    const resolvedProcessProperties = [];
    const iconPromises = [];
    const processes = await psList({ all: false });

    processes
      .filter(process => !process.name.endsWith(" Helper"))
      .forEach(process => {
        const fullCommand = process.cmd;

        const { name } = process;
        const { cpu } = process;
        const { pid } = process;
        const launchbarItem = {
          title: name,
          subtitle: fullCommand,
          badge: `CPU: %${cpu} / RAM: ${process.memory}`,
          action: "kill.sh",
          actionRunsInBackground: true,
          actionReturnsItems: false,
          pid,
          cpu
        };

        const genericIcon =
          "/System/Library/CoreServices/CoreTypes.bundle/Contents/Resources/ExecutableBinaryIcon.icns";
        let icon = genericIcon;
        // test if a process originates in an .app bundle, possibly with an icon
        const isProcessAnApp = fullCommand.match(/^.+?\.app\//);
        if (isProcessAnApp) {
          const pathToExecutable = isProcessAnApp[0];
          // also add a path property, mainly for quick look in launchbar
          launchbarItem.path = pathToExecutable;

          const cachedIcon = cache.get(pathToExecutable, {
            ignoreMaxAge: true
          });

          if (!cachedIcon) {
            icon = getIcon(pathToExecutable)
              .then(iconResult => {
                cache.set(pathToExecutable, iconResult, { maxAge: 5000 });
                return iconResult;
              })
              .catch(() => {
                return genericIcon;
              });
          } else {
            icon = cachedIcon;
          }
        }
        iconPromises.push(icon);
        resolvedProcessProperties.push(launchbarItem);
      });
    let output = [];
    const resolvedIcons = await Promise.all(iconPromises);
    for (let i = 0; i < resolvedIcons.length; i += 1) {
      const icon = resolvedIcons[i];
      resolvedProcessProperties[i].icon = icon;
      output.push(resolvedProcessProperties[i]);
    }
    output = output.sort(sortByCpuUsageDescending);
    return console.log(JSON.stringify(output, null, " "));
  } catch (error) {
    return console.log(error);
  }
})();
