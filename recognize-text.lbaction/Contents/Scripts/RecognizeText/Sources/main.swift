#!/usr/bin/env swift

import Cocoa
import Vision

func recognizeText(
  fullScreen: Bool,
  languages: [String],
  ignoreLineBreaks: Bool = false,
  customWords: [String] = [],
  useLanguageCorrection: Bool = true,
  fast: Bool = true,
) async throws -> String? {
  let mode: VNRequestTextRecognitionLevel = fast ? .fast : .accurate

  let screenCapture = URL(filePath: "/usr/sbin/screencapture")
  let task = try NSUserUnixTask(url: screenCapture)
  let args = fullScreen ? ["-c"] : ["-ci"]
  try await task.execute(withArguments: args)

  guard let pasteboard = NSPasteboard.general.pasteboardItems?.first,
        let fileType = pasteboard.types.first,
        let data = pasteboard.data(forType: fileType),
        let image = NSImage(data: data)?.cgImage(forProposedRect: nil, context: nil, hints: nil)
  else {
    return nil
  }

  var recognizedText = [String]()

  let request = VNRecognizeTextRequest { request, _ in
    guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
    for observation in observations {
      guard let candidate = observation.topCandidates(1).first else { continue }
      recognizedText.append(candidate.string)
    }
  }
  request.recognitionLevel = mode
  request.usesLanguageCorrection = useLanguageCorrection
  request.recognitionLanguages = languages
  request.customWords = customWords

  try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])

  return recognizedText.joined(separator: ignoreLineBreaks ? " " : "\n")
}

let fullScreen = CommandLine.arguments.contains("--full-screen")
let languages = ["en-US"]
let result = try await recognizeText(fullScreen: fullScreen, languages: languages) ?? ""
print(result.isEmpty ? "No text found, or an error has occurred" : result)
