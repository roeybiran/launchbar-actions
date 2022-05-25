import Foundation
import PDFKit

let paths = CommandLine.arguments.dropFirst().flatMap { (path: String) -> [String] in
  let sourceURL = URL(fileURLWithPath: path)

  guard let document = PDFDocument(url: sourceURL) else {
    _ = NSAlert.runModal(.init(error: PDFError.invalidPDF(name: sourceURL.lastPathComponent)))
    exit(0)
  }

  let basename = sourceURL.deletingPathExtension()

  let paths: [String] = (0..<document.pageCount).compactMap { page in
    guard let pageData = document.page(at: page)?.dataRepresentation else { return nil }
    let targetName = basename.deletingPathExtension().lastPathComponent + "_\(page + 1)"
    let targetURL = basename.deletingLastPathComponent().appendingPathComponent(targetName).appendingPathExtension("pdf")
    _ = PDFDocument(data: pageData)?.write(to: targetURL)
    return targetURL.path
  }

  return paths
}

print(paths.joined(separator: "\n"))

enum PDFError: LocalizedError {
  case invalidPDF(name: String)

  var errorDescription: String? {
    switch self {
    case .invalidPDF(let name):
      return "\(name) does not exist, or not a valid PDF."
    }
  }
}
