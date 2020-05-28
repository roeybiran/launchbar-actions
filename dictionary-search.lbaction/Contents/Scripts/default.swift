#!/usr/bin/env swift

import Cocoa
import CoreServices.DictionaryServices

// https://nshipster.com/dictionary-services/

struct LBItem: Encodable {
    let title: String
    let subtitle: String
    let url: String
    let icon = "com.apple.Dictionary"
}

if CommandLine.arguments.count <= 1 {
    exit(EXIT_SUCCESS)
}
let word = CommandLine.arguments.dropFirst().first!

var definitions: [(String, String)] = []
let spellChecker = NSSpellChecker.shared
var words = [word]
let nsrange = NSRange(word.startIndex..<word.endIndex, in: word)
if let guesses = spellChecker.guesses(forWordRange: nsrange, in: word, language: spellChecker.language(), inSpellDocumentWithTag: 0) {
    words = guesses
}
for word in words {
    let nsstring = word as NSString
    let cfrange = CFRange(location: 0, length: nsstring.length)
    guard let definition = DCSCopyTextDefinition(nil, nsstring, cfrange) else {
        continue
    }
    let definitionString = String(definition.takeUnretainedValue())
    definitions.append((word, definitionString))
}

var output: [LBItem] = []
for definition in definitions {
    let query = definition.0
    let answer = definition.1
    let title = answer.components(separatedBy: " | ")[0...1].joined(separator: " | ").trimmingCharacters(in: .whitespacesAndNewlines)
    let subtitle = answer.components(separatedBy: "|").dropFirst(2).joined(separator: " | ").trimmingCharacters(in: .whitespacesAndNewlines)
    output.append(LBItem(title: title, subtitle: subtitle, url: "dict://\(query)"))
}

let jsonData = try! JSONEncoder().encode(output)
let jsonString = String(data: jsonData, encoding: .utf8)!
print(jsonString)
