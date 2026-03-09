import SwiftUI

struct AISuggestChip: View {
    let text: String
    let action: () -> Void

    init(text: String = "Suggest →", action: @escaping () -> Void) {
        self.text = text
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack(spacing: 6) {
                Image(systemName: "sparkles")
                    .font(.system(size: 11))
                Text(text)
                    .font(.walletMono11)
            }
            .foregroundStyle(.walletPurple)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(Color.walletPurple.opacity(0.12))
            .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    AISuggestChip {}
        .padding()
        .background(Color.walletBG)
}
