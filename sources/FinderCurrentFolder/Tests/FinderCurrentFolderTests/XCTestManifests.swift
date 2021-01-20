import XCTest

#if !canImport(ObjectiveC)
public func allTests() -> [XCTestCaseEntry] {
    return [
        testCase(FinderCurrentFolderTests.allTests),
    ]
}
#endif
