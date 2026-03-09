#if os(macOS)
import SwiftUI

struct CardTrayView: View {
    var cardStore: CardStore
    var contextEngine: ContextEngine
    @State private var selectedCard: WalletCard?
    @State private var editingCard: WalletCard?

    var body: some View {
        ZStack {
            Color.walletBG.ignoresSafeArea()

            VStack(spacing: 0) {
                // Header — 44pt
                TrayHeaderView()

                // Card list or detail
                if let selected = selectedCard {
                    CardDetailView(
                        card: selected,
                        onBack: { withAnimation(.walletSpring) { selectedCard = nil } },
                        onEdit: { editingCard = selected },
                        onInject: { injectCard(selected) }
                    )
                    .transition(.asymmetric(
                        insertion: .move(edge: .trailing).combined(with: .opacity),
                        removal: .move(edge: .trailing).combined(with: .opacity)
                    ))
                } else {
                    ScrollView {
                        VStack(spacing: 1) {
                            ForEach(cardStore.cards) { card in
                                CardRowView(card: card)
                                    .onTapGesture {
                                        withAnimation(.walletSpring) {
                                            selectedCard = card
                                        }
                                    }
                            }
                        }
                    }
                    .transition(.asymmetric(
                        insertion: .move(edge: .leading).combined(with: .opacity),
                        removal: .move(edge: .leading).combined(with: .opacity)
                    ))
                }

                // Footer — 36pt
                TrayFooterView(contextEngine: contextEngine)
            }
        }
        .frame(width: 320)
        .sheet(item: $editingCard) { card in
            CardEditorView(card: card) { updated in
                cardStore.update(updated)
                selectedCard = updated
                editingCard = nil
            }
        }
    }

    private func injectCard(_ card: WalletCard) {
        InjectionService.copyToClipboard(
            InjectionService.format(cards: [card], app: contextEngine.detectedApp)
        )
        cardStore.markInjected([card.id])
    }
}

// MARK: - Header

struct TrayHeaderView: View {
    var body: some View {
        HStack {
            Text("WALLET")
                .font(.walletMono11)
                .foregroundStyle(.walletCyan)

            Spacer()

            Image(systemName: "magnifyingglass")
                .font(.system(size: 13))
                .foregroundStyle(.walletMuted)
                .padding(.trailing, 8)

            Image(systemName: "plus")
                .font(.system(size: 13))
                .foregroundStyle(.walletMuted)
        }
        .padding(.horizontal, 14)
        .frame(height: 44)
    }
}

// MARK: - Footer

struct TrayFooterView: View {
    var contextEngine: ContextEngine

    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(Color.walletGreen)
                .frame(width: 6, height: 6)

            Text("CONTEXT ACTIVE")
                .font(.walletMono10)
                .foregroundStyle(.walletMuted)

            if contextEngine.detectedApp != .unknown {
                Text("· \(contextEngine.detectedApp.displayName)")
                    .font(.walletMono10)
                    .foregroundStyle(.walletMuted.opacity(0.6))
            }

            Spacer()

            Image(systemName: "gearshape")
                .font(.system(size: 12))
                .foregroundStyle(.walletMuted)
        }
        .padding(.horizontal, 14)
        .frame(height: 36)
        .background(Color.walletSurface.opacity(0.5))
    }
}
#endif
