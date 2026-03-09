import Foundation

struct MCPBridge {
    static let sharedDirectory: URL = {
        let appSupport = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first!
        let walletDir = appSupport.appendingPathComponent("Wallet", isDirectory: true)
        try? FileManager.default.createDirectory(at: walletDir, withIntermediateDirectories: true)
        return walletDir
    }()

    static let cardsFileURL = sharedDirectory.appendingPathComponent("cards.json")

    static func syncCards(_ cards: [WalletCard]) {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        encoder.dateEncodingStrategy = .iso8601
        guard let data = try? encoder.encode(cards) else { return }
        try? data.write(to: cardsFileURL, options: .atomic)
    }

    static func readCards() -> [WalletCard]? {
        guard let data = try? Data(contentsOf: cardsFileURL) else { return nil }
        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        return try? decoder.decode([WalletCard].self, from: data)
    }
}
