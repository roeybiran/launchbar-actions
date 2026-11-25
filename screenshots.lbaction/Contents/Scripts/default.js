function run() {
  const delayValues = [3, 5, 10];

  // Current timestamp
  const now = new Date()
    .toISOString()
    .replace(/:/g, "-")
    .replace("T", "-")
    .split(".")[0];

  // File paths
  const screenshotFile = {
    path: LaunchBar.homeDirectory + "/Desktop",
    name: `screencapture_${now}`,
    extension: "png",
  };

  // Options array
  const options = [
    // Screenshots to clipboard
    { title: "Capture Selection to Clipboard", screencaptureOptions: "sc" },
    { title: "Capture Window to Clipboard", screencaptureOptions: "wc" },
    { title: "Capture Screen to Clipboard", screencaptureOptions: "Sc", destination: screenshotFile },
    // Screenshots to desktop
    { title: "Capture Selection to Desktop", screencaptureOptions: "s", destination: screenshotFile },
    { title: "Capture Window to Desktop", screencaptureOptions: "w", destination: screenshotFile },
    { title: "Capture Screen to Desktop", screencaptureOptions: "S", destination: screenshotFile },
    // Screenshots + annotations
    { title: "Capture Selection, Annotate", screencaptureOptions: "su", destination: screenshotFile },
    { title: "Capture Window, Annotate", screencaptureOptions: "wu", destination: screenshotFile },
    { title: "Capture Screen, Annotate", screencaptureOptions: "Su", destination: screenshotFile },
    // Recordings + annotations
    { title: "Record Selection, Annotate", screencaptureOptions: "svuUik", destination: screenshotFile },
    // { title: "Record Window, Annotate", screencaptureOptions: "Wvu", destination: screenshotFile },
    { title: "Record Screen, Annotate", screencaptureOptions: "SvuUik", destination: screenshotFile },
  ];

  // Generate output
  const output = options.map((opt) => {
    const baseOption = {
      ...opt,
      actionRunsInBackground: true,
      actionReturnsItems: false,
      icon: opt.title.startsWith("Capture")
        ? "font-awesome:fa-camera"
        : "font-awesome:fa-video-camera",
      action: "choice",
      children: [],
    };

    // Add delay values
    baseOption.children = delayValues.map((delayVal) => ({
      ...baseOption,
      delayValue: delayVal,
      badge: `${delayVal} seconds delay`,
    }));

    return baseOption;
  });

  return output;
}

function choice(arg) {
  LaunchBar.hide();

  const optionsStr = arg.screencaptureOptions;
  const ui = optionsStr.includes("u");

  let screencaptureOptions = [...optionsStr].map((c) => `-${c}`);

  // Delays
  if (arg.delayValue) {
    // User-specified
    screencaptureOptions.push("-T", arg.delayValue)
  } else if (optionsStr.includes("S")) {
    // Delay for full-screen capture to hide LaunchBar itself
    screencaptureOptions.push("-T", 0.5)
  }

  let destination;
  // Handle destination file deduplication
  if (arg.destination) {
    const dirname = arg.destination.path;
    let basename = arg.destination.name;
    const extension = arg.destination.extension;

    destination = `${dirname}/${basename}.${extension}`;
    while (File.exists(destination)) {
      basename += "_copy";
      destination = `${dirname}/${basename}.${extension}`;
    }
  }

  LaunchBar.execute(
    "/usr/sbin/screencapture",
    ...screencaptureOptions,
    destination,
  );

  // Additional UI interaction if required
  if (ui) {
  LaunchBar.execute("/usr/bin/osascript", 
    "-e",
    "delay 0.5",
    "-e",
    'tell application "System Events" to click button 1 of window 1 of application process "screencaptureui"',
  );
  }
}
