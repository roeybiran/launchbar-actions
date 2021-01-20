import Cocoa
import CoreServices.DictionaryServices

// https://nshipster.com/dictionary-services/

struct LBItem: Encodable {
    let title: String
    let subtitle: String
    let url: String
    let icon = "com.apple.Dictionary"
    let exactMatch: Bool
}

if CommandLine.arguments.count <= 1 {
    exit(EXIT_SUCCESS)
}
let originalQuery = CommandLine.arguments.dropFirst().first!

let spellChecker = NSSpellChecker.shared
let nsrange = NSRange(originalQuery.startIndex..<originalQuery.endIndex, in: originalQuery)
let guesses = spellChecker.guesses(forWordRange: nsrange, in: originalQuery, language: spellChecker.language(), inSpellDocumentWithTag: 0) ?? []

let output: [LBItem] = ([originalQuery] + guesses)
    .compactMap { guess in
        let guessString = guess as NSString
        let cfrange = CFRange(location: 0, length: guessString.length)
        guard let definition = DCSCopyTextDefinition(nil, guessString, cfrange) else { return nil }
        let definitionString = String(definition.takeUnretainedValue())
        let exactMatch = guess.lowercased() == originalQuery.lowercased()
        let subtitle = definitionString
            .components(separatedBy: " | ")
            .dropFirst(2)
            .joined(separator: " | ")
            .trimmingCharacters(in: .whitespacesAndNewlines)
        return LBItem(title: guess, subtitle: subtitle, url: "dict://\(guess)", exactMatch: exactMatch)
    }
    .sorted {
        if $1.exactMatch && !$0.exactMatch { return false }
        return true
    }

let jsonData = try! JSONEncoder().encode(output)
let jsonString = String(data: jsonData, encoding: .utf8)!
print(jsonString)
