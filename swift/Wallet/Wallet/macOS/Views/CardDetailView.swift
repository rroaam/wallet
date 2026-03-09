#if os(macOS)
import SwiftUI

struct CardDetailView: View {
    let card: WalletCard
    let onBack: () -> Void
    let onEdit: () -> Void
    let onInject: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header — 44pt
            HStack {
                Button(action: onBack) {
                    HStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 12, weight: .medium))
                        Text("Back")
                            .font(.walletBody)
                    }
                    .foregroundStyle(.walletMuted)
                }
                .buttonStyle(.plain)

                Spacer()

                Text(card.name)
                    .font(.walletSemi)
                    .foregroundStyle(.walletWhite)

                Spacer()

                Button(action: onEdit) {
                    Image(systemName: "pencil")
                        .font(.system(size: 13))
                        .foregroundStyle(.walletMuted)
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 14)
            .frame(height: 44)

            Divider()
                .background(Color.walletBorder)

            // Content
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    // Icon + summary
                    HStack(spacing: 10) {
                        Image(systemName: card.icon)
                            .font(.system(size: 20))
                            .foregroundStyle(.walletPurple)

                        VStack(alignment: .leading, spacing: 2) {
                            Text(card.name)
                                .font(.walletH2)
                                .foregroundStyle(.walletWhite)
                            Text(card.id.tag)
                                .font(.walletMono10)
                                .foregroundStyle(.walletMuted)
                        }
                    }
                    .padding(.top, 8)

                    // Content text
                    Text(card.content)
                        .font(.walletBody)
                        .foregroundStyle(.walletWhite.opacity(0.85))
                        .lineSpacing(4)

                    // Metadata
                    if let lastInjected = card.lastInjected {
                        HStack(spacing: 4) {
                            Image(systemName: "arrow.up.circle")
                                .font(.system(size: 10))
                            Text("Last injected \(lastInjected.formatted(.relative(presentation: .named)))")
                                .font(.walletMono10)
                        }
                        .foregroundStyle(.walletMuted)
                    }

                    Text("Surfaces when: \(card.id.surfacesWhen)")
                        .font(.walletMono10)
                        .foregroundStyle(.walletMuted.opacity(0.6))
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
            }

            Spacer()

            // Inject button
            InjectButton(
                subtitle: card.lastInjected.map {
                    "Last injected \($0.formatted(.relative(presentation: .named)))"
                },
                action: onInject
            )
            .padding(.bottom, 12)
        }
        .frame(width: 320)
    }
}

#Preview {
    CardDetailView(
        card: CardStore.mockCards()[0],
        onBack: {},
        onEdit: {},
        onInject: {}
    )
    .background(Color.walletBG)
}
#endif
