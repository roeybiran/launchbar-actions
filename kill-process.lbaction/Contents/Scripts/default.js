// LaunchBar Action Script

function run() {
	return JSON.parse(
		LaunchBar.execute(
			`${Action.path}/Contents/Scripts/KillProcess/KillProcess/main`
		)
	).map((x) => ({
		title: x.name,
		subtitle: x.path,
		icon: x.path,
		actionArgument: String(x.pid),
		action: 'kill',
	}));
}

function kill(pid) {
	LaunchBar.execute('/bin/kill', '-9', pid);
}
