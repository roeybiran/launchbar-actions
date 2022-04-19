#!/usr/bin/env swift

import Foundation
import Cocoa

struct Process: Encodable, Comparable {
	let name: String
	let path: String
	let pid: pid_t

	static func < (lhs: Process, rhs: Process) -> Bool {
		lhs.name < rhs.name
	}
}

let processes: [Process] = NSWorkspace
	.shared
	.runningApplications
	.compactMap { app in
		guard let name = app.localizedName else { return nil }
		guard let path = (app.bundleURL ?? app.executableURL) else { return nil }
		return Process(name: name, path: path.path, pid: app.processIdentifier)
	}
	.sorted()

print(String(data: try! JSONEncoder().encode(processes), encoding: .utf8)!)
