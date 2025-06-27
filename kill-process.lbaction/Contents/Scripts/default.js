// LaunchBar Action Script

function run() {
  const psOutput = LaunchBar.execute("/bin/ps", "-axo", "pid,%cpu,comm", "-r");
  const lines = psOutput.split("\n").slice(1); // Skip header line

  return lines
    .filter((line) => line.trim()) // Remove empty lines
    .map((line) => {
      const [pid, cpu, ...comm] = line.trim().split(/\s+/);

	  let command = comm.join(" ");
	  let icon;
	  let displayPath;
	  let title;
      if (command.includes('.app')) {
        const appIndex = command.indexOf('.app');
        displayPath = command.substring(0, appIndex + 4); // Include .app in the path
		title = File.displayName(displayPath);
		icon = displayPath;
      } else {
		title = command.split('/').pop();
		displayPath = command;
		icon = command;
	  }

      return {
        title,
        subtitle: command,
        icon,
		path: command,
        actionArgument: pid,
        badge: `${cpu}%`,
        action: "kill",
      };
    })
}

function kill(pid) {
  LaunchBar.execute("/bin/kill", "-9", pid);
}
