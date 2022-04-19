import Foundation

// sorting precendence
// 1. aliases
// 2. folders
// 3. everything else, sorted by the EXTENSION'S name
enum PathType: Int, Encodable {
    case alias = 0, folder, file
}

struct Path: Encodable, Comparable {
    let path: String
    let pathExtension: String
    let type: PathType

    public static func < (lhs: Path, rhs: Path) -> Bool {
        if lhs.type.rawValue != rhs.type.rawValue {
            return lhs.type.rawValue < rhs.type.rawValue
        }
        if lhs.pathExtension != rhs.pathExtension {
            return lhs.pathExtension < rhs.pathExtension
        }
        return lhs.path < rhs.path
    }

}

// https://www.swiftbysundell.com/tips/using-key-paths-in-switch-statements/
func ~=<T>(lhs: KeyPath<T, Bool?>, rhs: T) -> Bool {
    rhs[keyPath: lhs] ?? false
}

let fileManager = FileManager.default
let ignorables = Set([".DS_Store", ".localized"])
let resourcesKeys: [URLResourceKey] = [.isDirectoryKey, .isAliasFileKey, .isPackageKey]
let script = NSAppleScript(source: #"tell application "Finder" to POSIX path of (insertion location as alias)"#)!
let success = script.executeAndReturnError(nil)
let currentPath = success.stringValue!

let contents: [Path] = try!
    fileManager
    .contentsOfDirectory(at: URL(fileURLWithPath: currentPath), includingPropertiesForKeys: nil)
    .compactMap({ url in
        if ignorables.contains(url.lastPathComponent) { return nil }
        let type: PathType
        let resourceValues = try! url.resourceValues(forKeys: Set(resourcesKeys))
        switch resourceValues {
        case \.isPackage:
            type = .file
        case \.isDirectory:
            type = .folder
        case \.isAliasFile:
            type = .alias
        default:
            type = .file
        }
        return Path(path: url.path, pathExtension: url.pathExtension, type: type)
    })
    .sorted()


let json = try! JSONEncoder().encode(contents)
print(String(data: json, encoding: .utf8)!)
