import Cocoa

// let exclusionList = Set([
// 	"com.apple.finder",
// 	"com.apple.Safari",
// 	"desktop.WhatsApp",
// 	"com.googlecode.iterm2",
// 	"com.apple.mail",
// 	"com.getflywheel.lightning.local",
// 	"com.apple.dt.Xcode"
// ])

let exclusionList = ["com.apple.finder"] + (
	CommandLine
	.arguments
	.first(where: { $0.starts(with: "--exclude=")})?
	.dropFirst("--exclude=".count)
	.split(separator: ",")
	.map(String.init) ?? []
)

let workspace = NSWorkspace.shared

workspace
	.runningApplications
	.filter { app in
		if app.activationPolicy != .regular { return false }
		if exclusionList.contains(app.bundleIdentifier ?? "") { return false }
		if workspace.frontmostApplication == app && CommandLine.arguments.contains("--exclude-frontmost") {
			return false
		}
		return true
	}
	.forEach {
		$0.terminate()
	}
