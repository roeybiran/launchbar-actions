import Foundation

if CommandLine.arguments.count <= 1 {
    print("No paths specified")
    exit(EXIT_SUCCESS)
}


let fileManager = FileManager.default
let encoder = JSONEncoder()
let resourceKeys: [URLResourceKey] = [
    .nameKey, .isDirectoryKey, .isPackageKey, .isAliasFileKey, .isSymbolicLinkKey, .pathKey, .parentDirectoryURLKey
]

let paths: [FoundPath] = CommandLine.arguments
    .dropFirst()
    .compactMap({ folder in
    let topLevelFolder = URL(fileURLWithPath: folder)
    return
        fileManager
        .enumerator(at: topLevelFolder,
                includingPropertiesForKeys: resourceKeys,
                options: [.skipsPackageDescendants],
                errorHandler: nil)?
        .allObjects
        .compactMap { object in
            guard
                let url = object as? URL,
                let resourceValues = try? url.resourceValues(forKeys: Set(resourceKeys))
            else { return nil }
            return FoundPath(
                url: url,
                resourceValues: resourceValues,
                topLevelFolder: topLevelFolder
            )
        }
    })
    .reduce([], +)
    .sorted(by: <)

print(String(data: (try? encoder.encode(paths)) ?? Data(), encoding: .utf8) ?? "")

struct FoundPath: Encodable {
    static let ignoredFileNames = Set([".DS_Store", ".localized"])
    
    let name: String
    let pathExtension: String
    let absolutePath: String
    let relativePath: String
    let kind: FileKind

    init?(url: URL, resourceValues: URLResourceValues, topLevelFolder: URL) {
        guard
            let name = resourceValues.name,
            let path = resourceValues.path,
            !Self.ignoredFileNames.contains(name)
        else {
            return nil
        }
        self.name = name
        self.pathExtension = url.pathExtension
        self.absolutePath = path
        self.relativePath = ".\(path.replacingOccurrences(of: topLevelFolder.path, with: ""))"
        self.kind = FileKind(resourceValues)
    }
}

extension FoundPath: Comparable {
    static func < (lhs: FoundPath, rhs: FoundPath) -> Bool {
        if lhs.kind != rhs.kind {
            return lhs.kind < rhs.kind
        }
        if lhs.pathExtension != rhs.pathExtension {
            return rhs.pathExtension < lhs.pathExtension
        }
        return lhs.name < rhs.name
    }
}

enum FileKind: Int, Encodable {
    case folder, link, nonFolder
}

extension FileKind: Comparable {
    static func < (lhs: FileKind, rhs: FileKind) -> Bool {
        lhs.rawValue < rhs.rawValue
    }
}

extension FileKind {
    init(_ attributes: URLResourceValues) {
        if attributes.isPackage ?? false {
            self = .nonFolder
        } else if attributes.isSymbolicLink ?? false || attributes.isAliasFile ?? false {
            self = .link
        } else if attributes.isDirectory ?? false {
            self = .folder
        } else {
            self = .nonFolder
        }
    }
}
