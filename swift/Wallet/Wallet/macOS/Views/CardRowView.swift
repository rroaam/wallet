#if os(macOS)
import SwiftUI

struct CardRowView: View {
    let card: WalletCard

    var body: some View {
        HStack(spacing: 12) {
            // Icon
            Image(systemName: card.icon)
                .font(.system(size: 16))
                .foregroundStyle(.walletPurple.opacity(0.7))
                .frame(width: 24)

            // Labels
            VStack(alignment: .leading, spacing: 2) {
                Text(card.name)
                    .font(.walletMed)
                    .foregroundStyle(.walletWhite)

                Text(card.summary.isEmpty ? card.id.surfacesWhen : card.summary)
                    .font(.walletMono11)
                    .foregroundStyle(.walletMuted)
                    .lineLimit(1)
            }

            Spacer()

            // Active indicator
            if card.isActive {
                PulsingDotView(color: .walletCyan, size: 5)
            }

            // Tag
            Text(card.id.tag)
                .font(.walletMono10)
                .foregroundStyle(.walletMuted.opacity(0.5))
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .frame(height: 52)
        .background(
            card.isActive
                ? Color.walletPurple.opacity(0.06)
                : Color.clear
        )
        .overlay(
            card.isActive
                ? RoundedRectangle(cornerRadius: 8)
                    .stroke(Color.walletGradient, lineWidth: 1)
                : nil
        )
        .contentShape(Rectangle())
    }
}

#Preview {
    VStack(spacing: 1) {
        CardRowView(card: CardStore.mockCards()[0])
        CardRowView(card: {
            var c = CardStore.mockCards()[1]
            c.isActive = true
            return c
        }())
        CardRowView(card: CardStore.mockCards()[2])
    }
    .background(Color.walletBG)
    .frame(width: 320)
}
#endif
