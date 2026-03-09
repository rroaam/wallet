import SwiftUI

struct GradientBorderView: View {
    var radius: CGFloat = 16
    var lineWidth: CGFloat = 1

    var body: some View {
        RoundedRectangle(cornerRadius: radius)
            .stroke(Color.walletGradient, lineWidth: lineWidth)
    }
}

extension View {
    func gradientBorder(radius: CGFloat = 16, lineWidth: CGFloat = 1) -> some View {
        overlay(GradientBorderView(radius: radius, lineWidth: lineWidth))
    }
}

#Preview {
    RoundedRectangle(cornerRadius: 16)
        .fill(Color.walletSurface)
        .frame(width: 200, height: 100)
        .gradientBorder()
        .padding()
        .background(Color.walletBG)
}
