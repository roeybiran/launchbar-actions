import Foundation
import PDFKit

let arguments = CommandLine.arguments.dropFirst()
guard arguments.count > 1, let outFile = arguments.first else { exit(0) }
let destination = "\(URL(fileURLWithPath: outFile).deletingPathExtension().path)_merged.pdf"

arguments
  .map(URL.init(fileURLWithPath:))
  .compactMap(PDFDocument.init)
  .reduce(into: PDFDocument()) { partialResult, document in
    (0..<document.pageCount).forEach { pageIndex in
      guard let page = document.page(at: pageIndex) else { return }
      partialResult.insert(page, at: partialResult.pageCount)
    }
  }
  .write(to: .init(fileURLWithPath: destination))

print(destination)
