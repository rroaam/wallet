import SwiftUI

struct GlassCard: ViewModifier {
    var radius: CGFloat = 16
    var isActive: Bool = false

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: radius))
            .overlay(
                RoundedRectangle(cornerRadius: radius)
                    .stroke(
                        isActive
                            ? AnyShapeStyle(Color.walletGradient)
                            : AnyShapeStyle(Color.white.opacity(0.08)),
                        lineWidth: 1
                    )
            )
    }
}

extension View {
    func glassCard(radius: CGFloat = 16, isActive: Bool = false) -> some View {
        modifier(GlassCard(radius: radius, isActive: isActive))
    }
}
