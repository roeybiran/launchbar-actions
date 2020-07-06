#!/usr/bin/env swift

import Cocoa
import CoreServices.DictionaryServices

// https://nshipster.com/dictionary-services/

if CommandLine.arguments.count <= 1 {
    exit(EXIT_SUCCESS)
}
let originalQuery = CommandLine.arguments.dropFirst().first!

let spellChecker = NSSpellChecker.shared
let nsrange = NSRange(originalQuery.startIndex..<originalQuery.endIndex, in: originalQuery)
let guesses = spellChecker.guesses(forWordRange: nsrange, in: originalQuery, language: spellChecker.language(), inSpellDocumentWithTag: 0) ?? []

let output: [LBItem] = [[originalQuery], guesses]
    .joined()
    .compactMap {
        let guessString = $0 as NSString
        let cfrange = CFRange(location: 0, length: guessString.length)
        guard let definition = DCSCopyTextDefinition(nil, guessString, cfrange) else { return nil }
        let definitionString = String(definition.takeUnretainedValue())
        let exactMatch = $0 == originalQuery
        let subtitle = definitionString.formattedForLB(text: definitionString) { Array($0.dropFirst(2)) }
        return LBItem(title: $0, subtitle: subtitle, url: "dict://\($0)", exactMatch: exactMatch)
}
.sorted { (a, b) -> Bool in
    if b.exactMatch && !a.exactMatch { return false }
    return true
}

let jsonData = try! JSONEncoder().encode(output)
let jsonString = String(data: jsonData, encoding: .utf8)!
print(jsonString)

struct LBItem: Encodable {
    let title: String
    let subtitle: String
    let url: String
    let icon = "com.apple.Dictionary"
    let exactMatch: Bool
}

extension String {
    func formattedForLB(text: String, closure: ([String]) -> [String]) -> String {
        return
            closure(self.components(separatedBy: " | "))
                .joined(separator: " | ")
                .trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
