#!/usr/bin/env swift

import Cocoa
import CoreServices.DictionaryServices

// https://nshipster.com/dictionary-services/

if CommandLine.arguments.count <= 1 {
    exit(EXIT_SUCCESS)
}
let originalQuery = CommandLine.arguments.dropFirst().first!

struct LBItem: Encodable {
    let title: String
    let subtitle: String
    let url: String
    let icon = "com.apple.Dictionary"
    let exactMatch: Bool
}

extension String {
    func formattedForLB(text: String, closure: ([String]) -> [String]) -> String {
        let result = closure(self.components(separatedBy: " | "))
        return result
            .joined(separator: " | ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
    }
}

var definitions: [(String, String)] = []
let spellChecker = NSSpellChecker.shared

let nsrange = NSRange(originalQuery.startIndex..<originalQuery.endIndex, in: originalQuery)
var queries = [originalQuery]
if let guesses = spellChecker.guesses(forWordRange: nsrange, in: originalQuery, language: spellChecker.language(), inSpellDocumentWithTag: 0) {
    queries = guesses
}
for guess in queries {
    let nsstring = guess as NSString
    let cfrange = CFRange(location: 0, length: nsstring.length)
    guard let definition = DCSCopyTextDefinition(nil, nsstring, cfrange) else {
        continue
    }
    let definitionString = String(definition.takeUnretainedValue())
    definitions.append((guess, definitionString))
}

var output: [LBItem] = []
for definition in definitions {
    let guess = definition.0
    let answer = definition.1
    let exactMatch = answer.range(of: originalQuery) != nil
    let title = guess
    let subtitle = answer.formattedForLB(text: answer) { Array($0.dropFirst(2)) }
    output.append(LBItem(title: title, subtitle: subtitle, url: "dict://\(guess)", exactMatch: exactMatch))
}

let jsonData = try! JSONEncoder().encode(output.sorted(by: { (a, b) -> Bool in
    if a.exactMatch && !b.exactMatch {
        return true
    }
    if b.exactMatch && !a.exactMatch {
        return false
    }
    return true
}))
let jsonString = String(data: jsonData, encoding: .utf8)!
print(jsonString)
