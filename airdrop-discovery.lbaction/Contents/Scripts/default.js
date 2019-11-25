// LaunchBar Action Script

airDrop = argument => {
  LaunchBar.hide();
  LaunchBar.executeAppleScriptFile(
    `${Action.path}/Contents/Scripts/airdropStates.scpt`,
    argument
  );
};

run = () => {
  if (LaunchBar.options.commandKey) {
    LaunchBar.hide();
    LaunchBar.openURL(
      File.fileURLForPath(
        "/System/Library/CoreServices/Finder.app/Contents/Applications/AirDrop.app"
      )
    );
  } else if (LaunchBar.options.shiftKey) {
    LaunchBar.executeAppleScriptFile(
      `${Action.path}/Contents/Scripts/openAirdrop.scpt`
    );
  } else {
    const output = [];
    const airDropStates = ["No One", "Contacts Only", "Everyone"];
    airDropStates.forEach(state => {
      output.push({
        title: state,
        actionArgument: state,
        icon:
          "/System/Library/CoreServices/Finder.app/Contents/Applications/AirDrop.app/Contents/Resources/OpenAirDropAppIcon.icns",
        action: "airDrop",
        actionRunsInBackground: true,
        actionReturnsItems: false
      });
    });
    return output;
  }
};
