#!/usr/bin/env swift

import Foundation

let ignoredFiles = [".DS_Store", ".localized"]
let fileManager = FileManager.default
let relativeDateFormatter = RelativeDateTimeFormatter()
let resourceKeys: [URLResourceKey] = [.addedToDirectoryDateKey]
let jsonEncoder = JSONEncoder()

let verb = "Downloaded"
let targetFolder = fileManager.homeDirectoryForCurrentUser.appendingPathComponent("Downloads")

struct FoundItem: Codable {
    var path: String
    var subtitle: String
    var date: Date
}

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
