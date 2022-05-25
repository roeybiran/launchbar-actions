import Foundation
import PDFKit

CommandLine.arguments.dropFirst().forEach {
  let sourceURL = URL(fileURLWithPath: $0)

  guard let document = PDFDocument(url: sourceURL) else {
    _ = NSAlert.runModal(.init(error: PDFError.invalidPDF(name: sourceURL.lastPathComponent)))
    return
  }

  let basename = sourceURL.deletingPathExtension()

  var paths = [String]()
  for i in 0..<document.pageCount {
    guard let pageData = document.page(at: i)?.dataRepresentation else { continue }
    let targetName = basename.deletingPathExtension().lastPathComponent + "_\(i + 1)"
    let targetURL = basename.deletingLastPathComponent().appendingPathComponent(targetName).appendingPathExtension("pdf")
    paths.append(targetURL.path)
    _ = PDFDocument(data: pageData)?.write(to: targetURL)
  }
  print(paths.joined(separator: "\n"))
}

enum PDFError: LocalizedError {
  case invalidPDF(name: String)

  var errorDescription: String? {
    switch self {
    case .invalidPDF(let name):
      return "\(name) does not exist, or not a valid PDF."
    }
  }
}
