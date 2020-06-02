//
//  main.swift
//  recentfiles
//
//  Created by Roey Biran on 23/03/2020.
//  Copyright © 2020 Roey Biran. All rights reserved.
//

import Foundation

let name = "recent-files"

struct FoundItem: Codable {
    var path: String
    var subtitle: String
    var date: Date
}

let ignoredFiles = [".DS_Store", ".localized"]
let fileManager = FileManager.default
let relativeDateFormatter = RelativeDateTimeFormatter()
let resourceKeys: [URLResourceKey] = [.addedToDirectoryDateKey]
let jsonEncoder = JSONEncoder()

let args = CommandLine.arguments

var path: String?
var verb = "Added"

if args.count <= 1 {
    print("USAGE: \(name) PATH [verb]...")
    exit(0)
}

for (idx, arg) in args.enumerated() {
    if idx == 1 {
        if !arg.hasPrefix("/") {
            print("Invalid path argument")
            exit(0)
        }
        path = arg
    } else if idx == 2 {
        verb = CommandLine.arguments[2]
    }
}

let targetFolder = URL(fileURLWithPath: path!)
var foundItems = [FoundItem]()

do {
    let enumeratedPaths = try fileManager.contentsOfDirectory(at: targetFolder, includingPropertiesForKeys: resourceKeys, options: [])
    for enumeratedURL in enumeratedPaths {
        if ignoredFiles.contains(enumeratedURL.lastPathComponent) { continue }
        let resourceValues = try enumeratedURL.resourceValues(forKeys: [.addedToDirectoryDateKey])
        guard let addedDate = resourceValues.addedToDirectoryDate else { continue }
        let relativeDate = relativeDateFormatter.localizedString(for: addedDate, relativeTo: Date())
        let addedDateString = "\(verb) \(relativeDate)"
        let foundItem = FoundItem(path: enumeratedURL.path, subtitle: addedDateString, date: addedDate)
        foundItems.append(foundItem)
    }
    let sortedItems = foundItems.sorted { $0.date > $1.date }
    let json = try jsonEncoder.encode(sortedItems)
    guard let jsonString = String(data: json, encoding: .utf8) else { exit(0) }
    print(jsonString)
} catch {
    print(error)
}
