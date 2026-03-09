import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

extension Color {
    static let walletBG      = Color(hex: "090A11")
    static let walletSurface = Color(hex: "13141E")
    static let walletPanel   = Color(hex: "1A1B27")
    static let walletBorder  = Color(hex: "252636")
    static let walletPurple  = Color(hex: "7B61FF")
    static let walletCyan    = Color(hex: "00D9E8")
    static let walletGreen   = Color(hex: "10B981")
    static let walletAmber   = Color(hex: "F59E0B")
    static let walletWhite   = Color(hex: "EEEEF2")
    static let walletMuted   = Color(hex: "6B7280")

    static let walletGradient = LinearGradient(
        colors: [.walletPurple, .walletCyan],
        startPoint: .leading,
        endPoint: .trailing
    )
}

extension ShapeStyle where Self == LinearGradient {
    static var walletGradient: LinearGradient {
        LinearGradient(
            colors: [.walletPurple, .walletCyan],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
}
