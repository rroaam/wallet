import Foundation
import SwiftUI

@Observable
final class CardStore {
    private static let storageKey = "wallet_cards"

    var cards: [WalletCard] = []

    init() {
        cards = Self.load() ?? Self.mockCards()
    }

    func update(_ card: WalletCard) {
        guard let index = cards.firstIndex(where: { $0.id == card.id }) else { return }
        var updated = card
        updated.updatedAt = .now
        cards[index] = updated
        save()
    }

    func card(for id: CardID) -> WalletCard? {
        cards.first(where: { $0.id == id })
    }

    func markInjected(_ ids: [CardID]) {
        let now = Date.now
        for id in ids {
            guard let index = cards.firstIndex(where: { $0.id == id }) else { continue }
            cards[index].lastInjected = now
            cards[index].isActive = true
        }
        save()

        Task { @MainActor in
            try? await Task.sleep(for: .seconds(3))
            for id in ids {
                guard let index = cards.firstIndex(where: { $0.id == id }) else { continue }
                cards[index].isActive = false
            }
        }
    }

    func activeCards(for app: DetectedApp) -> [WalletCard] {
        let relevantIDs = app.relevantCards
        return cards.filter { relevantIDs.contains($0.id) && !$0.isEmpty }
    }

    private func save() {
        guard let data = try? JSONEncoder().encode(cards) else { return }
        UserDefaults.standard.set(data, forKey: Self.storageKey)
    }

    private static func load() -> [WalletCard]? {
        guard let data = UserDefaults.standard.data(forKey: storageKey),
              let cards = try? JSONDecoder().decode([WalletCard].self, from: data)
        else { return nil }
        return cards.isEmpty ? nil : cards
    }

    static func mockCards() -> [WalletCard] {
        [
            WalletCard(id: .identity, name: CardID.identity.displayName, icon: CardID.identity.icon, content: "Ryan Rosenthal — UI/UX designer and product builder. 10+ years shipping consumer and B2B products. I build tools that make creative work faster and AI more useful for non-technical people.", summary: "Product builder, 10yr UI/UX, AI tools", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .voice, name: CardID.voice.displayName, icon: CardID.voice.icon, content: "Direct and concise. No filler words. Lowercase when casual. Dashes over semicolons. Conviction-based — no hedging. Never say: game-changer, ecosystem, synergy, let me break it down. Contrarian but calm.", summary: "Direct, lowercase, no filler, contrarian", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .expertise, name: CardID.expertise.displayName, icon: CardID.expertise.icon, content: "UI/UX design, brand strategy, product architecture. UCLA psychology background. Deep in SwiftUI, Next.js, Tailwind, Supabase. Strong POV: AI tools should be opinionated, not blank canvases.", summary: "Design, brand, product, SwiftUI, Next.js", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .currentWork, name: CardID.currentWork.displayName, icon: CardID.currentWork.icon, content: "Building Wallet — a personal AI context layer for macOS and iOS. Also shipping r0am.io (startup validation marketplace) and Brand Better (AI creative suite). Solo founder, all three products.", summary: "Wallet, r0am.io, Brand Better — solo", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .audience, name: CardID.audience.displayName, icon: CardID.audience.icon, content: "Creators, solo founders, brand builders, vibe coders. People who use AI daily but waste time re-explaining themselves. They want tools that just know them. Fear: being generic. Desire: feeling understood.", summary: "Creators, founders, vibe coders", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .aesthetic, name: CardID.aesthetic.displayName, icon: CardID.aesthetic.icon, content: "Dark mode, glass surfaces, purple-cyan gradients. Brutalist accents with editorial typography. References: Linear, Arc Browser, Teenage Engineering. Generous whitespace. No AI slop.", summary: "Dark, glass, brutalist, editorial", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .narrative, name: CardID.narrative.displayName, icon: CardID.narrative.icon, content: "Had 100+ startup ideas, never shipped — not because I couldn't build, but because I was paralyzed by knowing too many failure patterns. Built r0am to solve that for others. Now building the AI identity layer because every tool asks who you are and nobody should answer that twice.", summary: "Paralyzed by patterns → built the fix", isActive: false, lastInjected: nil, updatedAt: .now),
            WalletCard(id: .goals, name: CardID.goals.displayName, icon: CardID.goals.icon, content: "Ship Wallet beta to 50 users by end of March. Prove that personal context injection makes AI tools 10x more useful without any extra effort from the user.", summary: "Wallet beta → 50 users by March", isActive: false, lastInjected: nil, updatedAt: .now),
        ]
    }
}
