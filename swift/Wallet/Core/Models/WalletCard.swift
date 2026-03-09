import Foundation

struct WalletCard: Identifiable, Codable, Equatable {
    let id: CardID
    var name: String
    var icon: String
    var content: String
    var summary: String
    var isActive: Bool
    var lastInjected: Date?
    var updatedAt: Date

    static let maxContentLength = 500
    static let maxSummaryLength = 80

    var trimmedContent: String {
        String(content.prefix(Self.maxContentLength))
    }

    var trimmedSummary: String {
        String(summary.prefix(Self.maxSummaryLength))
    }

    var isEmpty: Bool {
        content.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}

extension WalletCard {
    static func blank(for cardID: CardID) -> WalletCard {
        WalletCard(
            id: cardID,
            name: cardID.displayName,
            icon: cardID.icon,
            content: "",
            summary: "",
            isActive: false,
            lastInjected: nil,
            updatedAt: .now
        )
    }
}
