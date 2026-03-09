import Foundation

/// Bridge between the native Wallet app and the MCP Node.js server.
/// The app writes card data to a shared JSON file that the MCP server reads.
struct MCPBridge {
    static let sharedDirectory: URL = {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let walletDir = appSupport.appendingPathComponent("Wallet", isDirectory: true)
        try? FileManager.default.createDirectory(at: walletDir, withIntermediateDirectories: true)
        return walletDir
    }()

    static let cardsFileURL = sharedDirectory.appendingPathComponent("cards.json")

    /// Write all cards to the shared JSON file for MCP server consumption
    static func syncCards(_ cards: [WalletCard]) {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601

        guard let data = try? encoder.encode(cards) else { return }
        try? data.write(to: cardsFileURL, options: .atomic)
    }

    /// Read cards from the shared JSON file
    static func readCards() -> [WalletCard]? {
        guard let data = try? Data(contentsOf: cardsFileURL) else { return nil }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode([WalletCard].self, from: data)
    }
}
