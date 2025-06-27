#!/usr/bin/env swift

import Cocoa

let exclusionList = Set([
	"com.apple.finder",
	"com.apple.Safari",
	"desktop.WhatsApp",
	"com.googlecode.iterm2",
	"com.apple.mail",
	"com.getflywheel.lightning.local",
  "com.apple.dt.Xcode",
])

let workspace = NSWorkspace.shared

workspace
	.runningApplications
	.filter { $0.activationPolicy == .regular }
	.filter { !exclusionList.contains($0.bundleIdentifier ?? "") }
	// .filter { workspace.frontmostApplication != $0 }
	.forEach {
		$0.terminate()
	}

