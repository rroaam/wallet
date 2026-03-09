import Testing
@testable import Wallet

@Test func formatIncludesWalletContextTags() {
    let cards = [CardStore.mockCards()[0]] // Identity
    let output = InjectionService.format(cards: cards, app: .claude)

    #expect(output.contains("[WALLET CONTEXT]"))
    #expect(output.contains("[/WALLET CONTEXT]"))
    #expect(output.contains("IDENTITY:"))
}

@Test func formatIncludesMultipleCards() {
    let mock = CardStore.mockCards()
    let cards = [mock[0], mock[1]] // Identity + Voice
    let output = InjectionService.format(cards: cards, app: .claude)

    #expect(output.contains("IDENTITY:"))
    #expect(output.contains("VOICE:"))
}

@Test func formatCurrentWorkLabel() {
    let mock = CardStore.mockCards()
    let cards = [mock[3]] // CurrentWork
    let output = InjectionService.format(cards: cards, app: .notion)

    #expect(output.contains("CURRENT WORK:"))
}

@Test func formatEmptyCardsReturnsEmpty() {
    let output = InjectionService.format(cards: [], app: .unknown)
    #expect(output.isEmpty)
}
