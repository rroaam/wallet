#if os(iOS)
import SwiftUI

struct IOSCardDetailView: View {
    let card: WalletCard
    var cardStore: CardStore
    @State private var editingCard: WalletCard?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header
                HStack(spacing: 12) {
                    Image(systemName: card.icon)
                        .font(.system(size: 24))
                        .foregroundStyle(.walletPurple)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(card.name)
                            .font(.walletDisplay)
                            .foregroundStyle(.walletWhite)
                        Text(card.id.tag)
                            .font(.walletMono11)
                            .foregroundStyle(.walletMuted)
                    }
                }

                // Content
                Text(card.content)
                    .font(.system(size: 16))
                    .foregroundStyle(.walletWhite.opacity(0.85))
                    .lineSpacing(6)

                // Metadata
                VStack(alignment: .leading, spacing: 8) {
                    if let lastInjected = card.lastInjected {
                        Label(
                            "Last injected \(lastInjected.formatted(.relative(presentation: .named)))",
                            systemImage: "arrow.up.circle"
                        )
                        .font(.walletMono11)
                        .foregroundStyle(.walletMuted)
                    }

                    Label(
                        "Surfaces when: \(card.id.surfacesWhen)",
                        systemImage: "sparkles"
                    )
                    .font(.walletMono11)
                    .foregroundStyle(.walletMuted.opacity(0.6))
                }
                .padding(.top, 8)
            }
            .padding(.horizontal, 20)
            .padding(.top, 16)
        }
        .background(Color.walletBG)
        .safeAreaInset(edge: .bottom) {
            InjectButton(label: "Copy to Clipboard") {
                InjectionService.copyToClipboard(
                    InjectionService.format(cards: [card], app: .unknown)
                )
                cardStore.markInjected([card.id])

                let generator = UIImpactFeedbackGenerator(style: .medium)
                generator.impactOccurred()
            }
            .padding(.bottom, 16)
            .background(.ultraThinMaterial)
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button(action: { editingCard = card }) {
                    Image(systemName: "pencil")
                        .foregroundStyle(.walletMuted)
                }
            }
        }
        .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
        .sheet(item: $editingCard) { card in
            IOSCardEditorView(card: card) { updated in
                cardStore.update(updated)
                editingCard = nil
            }
        }
    }
}
#endif
