// https://www.swiftbysundell.com/articles/building-a-command-line-tool-using-the-swift-package-manager/

import Foundation

let packageName = "recent_files"
let args = CommandLine.arguments

if args.count != 3 {
    print("USAGE: \(packageName) PATH --verb=VERB...")
    exit(EXIT_FAILURE)
}

struct FoundItem: Encodable {
    let path: String
    let subtitle: String
    let date: Date
}

let path = args[1]
let verb = args[2]
let ignoredFiles: Set<String> = [".DS_Store", ".localized"]
let relativeDateFormatter = RelativeDateTimeFormatter()
let now = Date()
let resourceKeys = [URLResourceKey.addedToDirectoryDateKey]
let jsonEncoder = JSONEncoder()

let targetFolder = URL(fileURLWithPath: path)

do {
    let enumeratedPaths: [FoundItem] = try
        FileManager
        .default
        .contentsOfDirectory(at: targetFolder, includingPropertiesForKeys: resourceKeys, options: [])
        .compactMap({ url in
            guard
                !ignoredFiles.contains(url.lastPathComponent),
                let resourceValues = try? url.resourceValues(forKeys: Set(resourceKeys)),
                let addedDate = resourceValues.addedToDirectoryDate
            else { return nil }
            let relativeDate = relativeDateFormatter.localizedString(for: addedDate, relativeTo: now)
            let addedDateString = "\(verb) \(relativeDate)"
            return FoundItem(path: url.path, subtitle: addedDateString, date: addedDate)
        })
        .sorted(by: { $0.date > $1.date })
    let json = try jsonEncoder.encode(enumeratedPaths)
    guard let jsonString = String(data: json, encoding: .utf8) else { exit(EXIT_FAILURE) }
    print(jsonString)
} catch let error {
    print(error.localizedDescription)
    exit(EXIT_FAILURE)
}


