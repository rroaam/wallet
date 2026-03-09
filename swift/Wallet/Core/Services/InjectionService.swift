import Foundation
#if os(macOS)
import AppKit
#else
import UIKit
#endif

enum InjectionMethod {
    case ambient
    case manual
    case mcp
}

struct InjectionService {
    static func format(cards: [WalletCard], app: DetectedApp) -> String {
        guard !cards.isEmpty else { return "" }

        var lines = ["[WALLET CONTEXT]"]
        lines.append("The following is personal context about the user.")
        lines.append("Use it to calibrate your responses appropriately.")
        lines.append("")

        for card in cards {
            let label = card.id.rawValue.uppercased()
                .replacingOccurrences(of: "CURRENTWORK", with: "CURRENT WORK")
            lines.append("\(label): \(card.content)")
        }

        lines.append("")
        lines.append("[/WALLET CONTEXT]")

        return lines.joined(separator: "\n")
    }

    static func copyToClipboard(_ text: String) {
        #if os(macOS)
        let pasteboard = NSPasteboard.general
        pasteboard.clearContents()
        pasteboard.setString(text, forType: .string)
        #else
        UIPasteboard.general.string = text
        #endif
    }

    static func inject(cards: [WalletCard], for app: DetectedApp) {
        let formatted = format(cards: cards, app: app)
        guard !formatted.isEmpty else { return }
        copyToClipboard(formatted)
    }
}
