import SwiftUI

struct PulsingDotView: View {
    @State private var scale: CGFloat = 1
    var color: Color = .walletPurple
    var size: CGFloat = 5

    var body: some View {
        Circle()
            .fill(color)
            .frame(width: size, height: size)
            .scaleEffect(scale)
            .opacity(2 - scale)
            .onAppear {
                withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                    scale = 1.8
                }
            }
    }
}

struct PulsingDotsView: View {
    var body: some View {
        HStack(spacing: 3) {
            PulsingDotView(color: .walletPurple, size: 4)
            PulsingDotView(color: .walletPurple.opacity(0.8), size: 4)
                .animation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true).delay(0.2), value: UUID())
            PulsingDotView(color: .walletCyan, size: 4)
                .animation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true).delay(0.4), value: UUID())
        }
    }
}
