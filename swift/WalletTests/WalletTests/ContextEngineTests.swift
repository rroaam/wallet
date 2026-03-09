import Testing
@testable import Wallet

@Test func detectedAppMapsCorrectly() {
    #expect(DetectedApp(bundleID: "com.anthropic.claude") == .claude)
    #expect(DetectedApp(bundleID: "notion.id") == .notion)
    #expect(DetectedApp(bundleID: "com.figma.Desktop") == .figma)
    #expect(DetectedApp(bundleID: "com.apple.mail") == .mail)
    #expect(DetectedApp(bundleID: "com.linear") == .linear)
    #expect(DetectedApp(bundleID: "com.openai.chat") == .chatgpt)
    #expect(DetectedApp(bundleID: "com.random.app") == .unknown)
}

@Test func relevantCardsForClaude() {
    let cards = DetectedApp.claude.relevantCards
    #expect(cards.contains(.voice))
    #expect(cards.contains(.identity))
    #expect(cards.contains(.narrative))
}

@Test func relevantCardsForFigma() {
    let cards = DetectedApp.figma.relevantCards
    #expect(cards.contains(.aesthetic))
    #expect(cards.contains(.currentWork))
}

@Test func unknownAppDefaultsToIdentity() {
    let cards = DetectedApp.unknown.relevantCards
    #expect(cards == [.identity])
}
