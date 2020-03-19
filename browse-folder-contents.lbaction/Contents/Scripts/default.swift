#!/usr/bin/env swift

import Foundation

enum FileKind: Int {
    case folder = 0, link, nonFolder
}

struct FoundPath: Codable {
    let title: String
    let subtitle: String
    let path: String
    let kind: FileKind.RawValue
}

let encoder = JSONEncoder()
let arguments = CommandLine.arguments.dropFirst()
//let arguments = ["/Users/roey/Desktop/folderbrowsertest/"]
let resourceKeys = [URLResourceKey.nameKey, .isDirectoryKey, .isPackageKey, .isAliasFileKey, .isSymbolicLinkKey, .pathKey, .parentDirectoryURLKey]
let ignoredFileNames = [".DS_Store", ".localized"]

var foundPaths = [FoundPath]()

for targetPath in arguments {
    let url = URL(fileURLWithPath: targetPath)
    let enumerator = FileManager.default.enumerator(at: url, includingPropertiesForKeys: resourceKeys, options: [.skipsPackageDescendants], errorHandler: nil)
    while let enumeratedObject = enumerator?.nextObject() as? NSURL {
        guard let fileAttributes = try? enumeratedObject.resourceValues(forKeys: resourceKeys),
            let nameKey = fileAttributes[.nameKey] as? String,
            let isDirectory = fileAttributes[.isDirectoryKey] as? Bool,
            let isPackage = fileAttributes[.isPackageKey] as? Bool,
            let isLink = fileAttributes[.isSymbolicLinkKey] as? Bool,
            let isAlias = fileAttributes[.isAliasFileKey] as? Bool,
            let path = fileAttributes[.pathKey] as? String,
            let parentDir = fileAttributes[.parentDirectoryURLKey] as? URL,
            !ignoredFileNames.contains(nameKey)
            else { continue }
        var fileKind: FileKind
        if isDirectory && !isPackage {
            fileKind = .folder
        } else {
            fileKind = .nonFolder
        }
        var relativePath = parentDir.path.replacingOccurrences(of: url.path, with: "")
        relativePath = "./\(relativePath)".replacingOccurrences(of: "//", with: "/")
        let foundPath = FoundPath(title: nameKey, subtitle: relativePath, path: path, kind: fileKind.rawValue)
        foundPaths.append(foundPath)
    }
}

foundPaths = foundPaths.sorted { $0.kind < $1.kind }
guard let json = try? encoder.encode(foundPaths), let jsonString = String(data: json, encoding: .utf8) else { exit(0) }
print(jsonString)

