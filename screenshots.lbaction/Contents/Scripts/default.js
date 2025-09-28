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
    {
      title: "Capture Selection to Clipboard",
      screencaptureOptions: "-ic",
    },
    {
      title: "Capture Window to Clipboard",
      screencaptureOptions: "-icW",
    },
    {
      title: "Capture Selection to Desktop",
      screencaptureOptions: "-i",
      destination: screenshotFile,
    },
    {
      title: "Capture Window to Desktop",
      screencaptureOptions: "-iW",
      destination: screenshotFile,
    },
    {
      title: "Capture Selection to Preview",
      screencaptureOptions: "-iP",
      destination: screenshotFile,
    },
    {
      title: "Capture Selection to Desktop & Annotate",
      screencaptureOptions: "-iUu",
      destination: screenshotFile,
      ui: "Capture Selected Portion",
    },
    {
      title: "Capture Screen to Clipboard",
      screencaptureOptions: "-Sc",
      destination: screenshotFile,
    },
    {
      title: "Capture Screen to Desktop",
      screencaptureOptions: "-S",
      destination: screenshotFile,
    },
    {
      title: "Capture Screen to Preview",
      screencaptureOptions: "-SP",
      destination: screenshotFile,
    },
    {
      title: "Capture Screen to Desktop & Annotate",
      screencaptureOptions: "-iUu",
      destination: screenshotFile,
      ui: "Capture Entire Screen",
    },
    {
      title: "Record Selection to Desktop & Annotate",
      screencaptureOptions: "-iUu",
      destination: screenshotFile,
      ui: "Record Selected Portion",
    },
    {
      title: "Record Screen to Desktop & Annotate",
      screencaptureOptions: "-iUu",
      destination: screenshotFile,
      ui: "Record Entire Screen",
    },
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

// Helper function to run AppleScript asynchronously
function asyncAppleScript(script) {
  // LaunchBar.executeAppleScript("delay 0.5", script);
  LaunchBar.execute("/usr/bin/osascript", [
    "-e",
    "delay 0.5",
    "-e",
    script,
    "&",
  ]);
};

function choice(arg) {
  LaunchBar.hide();

  const screencaptureOptions = arg.screencaptureOptions;
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

  // Delays
  if (arg.delayValue) {
    // User-specified
    LaunchBar.execute("/bin/sleep", arg.delayValue);
  } else if (/^-Sc$|^-S$|^-SP$/.test(screencaptureOptions)) {
    // Delay for full-screen capture
    LaunchBar.execute("/bin/sleep", 1);
  }

  // If UI interaction is required
  if (arg.ui) {
    asyncAppleScript(
      `tell application "System Events" to tell application process "screencaptureui" to tell window 1 to click checkbox "${arg.ui}"`
    );
  }

  // Execute screencapture command
  LaunchBar.execute(
    "/usr/sbin/screencapture",
    screencaptureOptions,
    "-tpng",
    destination ?? ""
  );

  // Additional UI interaction if required
  if (arg.ui) {
    asyncAppleScript(
      'tell application "System Events" to click button 1 of window 1 of application process "Screen Shot"'
    );
  }
}
