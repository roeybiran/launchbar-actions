import Cocoa
import CoreServices.DictionaryServices

// https://nshipster.com/dictionary-services/

struct DictionaryEntry: Encodable {
	let key: String
	let value: String
	let url: String
	let exactMatch: Bool
}

if CommandLine.arguments.count <= 1 {
	exit(EXIT_SUCCESS)
}

let originalQuery = CommandLine.arguments[1]
let spellChecker = NSSpellChecker.shared
let nsrange = NSRange(originalQuery.startIndex..<originalQuery.endIndex, in: originalQuery)
let guesses = spellChecker.guesses(forWordRange: nsrange, in: originalQuery, language: spellChecker.language(), inSpellDocumentWithTag: 0)

let output: [DictionaryEntry] = ([originalQuery] + (guesses ?? []))
	.compactMap { guess in
		let guessString = guess as NSString
		let cfrange = CFRange(location: 0, length: guessString.length)
		guard let definition = DCSCopyTextDefinition(nil, guessString, cfrange) else { return nil }
		let definitionString = String(definition.takeRetainedValue())
		let exactMatch = guess.lowercased() == originalQuery.lowercased()
		let definitions = definitionString
			.components(separatedBy: " | ")
			.dropFirst(2)
			.joined(separator: " | ")
			.trimmingCharacters(in: .whitespacesAndNewlines)
		return DictionaryEntry(
			key: guess,
			value: definitions,
			url: "dict://\(guess)",
			exactMatch: exactMatch
		)
	}
	.sorted {
		$0.exactMatch && !$1.exactMatch
	}

let jsonData = try! JSONEncoder().encode(output)
let jsonString = String(data: jsonData, encoding: .utf8)!
print(jsonString)
