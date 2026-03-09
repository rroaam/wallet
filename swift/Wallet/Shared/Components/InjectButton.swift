import SwiftUI

struct InjectButton: View {
    let label: String
    let subtitle: String?
    let action: () -> Void

    init(
        label: String = "Inject into Claude",
        subtitle: String? = nil,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.subtitle = subtitle
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Text(label)
                    .font(.walletSemi)
                    .foregroundStyle(.white)

                if let subtitle {
                    Text(subtitle)
                        .font(.walletMono10)
                        .foregroundStyle(.white.opacity(0.5))
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 48)
            .background(Color.walletGradient)
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 16)
    }
}
