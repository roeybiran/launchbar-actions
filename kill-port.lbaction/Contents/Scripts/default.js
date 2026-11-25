function run(argument) {
	if (!argument) {
		return;
	}

	const port = argument.trim();

	const output = LaunchBar.execute("/usr/sbin/lsof", "-ti", `:${port}`);

	if (!output?.trim()) {
		return [{ title: `No process on port ${port}` }];
	}

	const items = output
		.trim()
		.split("\n")
		.filter(Boolean)
		.map((pid) => {
			const command = LaunchBar.execute("/bin/ps", "-p", pid, "-o", "command=")?.trim() ?? "";

			return {
				title: command,
				subtile: command,
				badge: pid,
				actionArgument: pid,
				action: "kill",
			};
		});

	return items.length ? items : [{ title: `No process on port ${port}` }];
}

function kill(pid) {
	LaunchBar.execute("/bin/kill", "-9", pid);
}
