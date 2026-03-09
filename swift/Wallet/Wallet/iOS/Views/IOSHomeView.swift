#if os(iOS)
import SwiftUI

struct IOSHomeView: View {
    var cardStore: CardStore
    @State private var selectedCard: WalletCard?
    @State private var editingCard: WalletCard?

    var body: some View {
        TabView {
            // Cards tab
            NavigationStack {
                ScrollView {
                    LazyVStack(spacing: 12) {
                        ForEach(cardStore.cards) { card in
                            IOSCardTileView(card: card)
                                .onTapGesture {
                                    selectedCard = card
                                }
                                .swipeActions(edge: .trailing) {
                                    Button("Inject") {
                                        injectCard(card)
                                    }
                                    .tint(.walletCyan)
                                }
                                .swipeActions(edge: .leading) {
                                    Button("Edit") {
                                        editingCard = card
                                    }
                                    .tint(.walletPurple)
                                }
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 8)
                }
                .background(Color.walletBG)
                .navigationTitle("Wallet")
                .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
                .toolbarColorScheme(.dark, for: .navigationBar)
                .navigationDestination(item: $selectedCard) { card in
                    IOSCardDetailView(card: card, cardStore: cardStore)
                }
                .sheet(item: $editingCard) { card in
                    IOSCardEditorView(card: card) { updated in
                        cardStore.update(updated)
                        editingCard = nil
                    }
                }
            }
            .tabItem {
                Image(systemName: "rectangle.stack.fill")
                Text("Cards")
            }

            // Settings tab
            NavigationStack {
                IOSSettingsView(cardStore: cardStore)
            }
            .tabItem {
                Image(systemName: "gearshape")
                Text("Settings")
            }
        }
        .tint(.walletPurple)
    }

    private func injectCard(_ card: WalletCard) {
        InjectionService.copyToClipboard(
            InjectionService.format(cards: [card], app: .unknown)
        )
        cardStore.markInjected([card.id])

        let generator = UIImpactFeedbackGenerator(style: .medium)
        generator.impactOccurred()
    }
}

// MARK: - Card Tile (iOS)

struct IOSCardTileView: View {
    let card: WalletCard

    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: card.icon)
                .font(.system(size: 18))
                .foregroundStyle(.walletPurple.opacity(0.7))
                .frame(width: 28)

            VStack(alignment: .leading, spacing: 3) {
                Text(card.name)
                    .font(.walletMed)
                    .foregroundStyle(.walletWhite)

                Text(card.summary.isEmpty ? card.id.surfacesWhen : card.summary)
                    .font(.walletMono11)
                    .foregroundStyle(.walletMuted)
                    .lineLimit(1)
            }

            Spacer()

            if card.isActive {
                PulsingDotView(color: .walletCyan, size: 6)
            }

            Text(card.id.tag)
                .font(.walletMono10)
                .foregroundStyle(.walletMuted.opacity(0.5))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 14)
        .frame(height: 72)
        .glassCard(radius: 14, isActive: card.isActive)
    }
}

// MARK: - Settings

struct IOSSettingsView: View {
    var cardStore: CardStore

    var body: some View {
        List {
            Section("Context Engine") {
                HStack {
                    Text("MCP Server")
                    Spacer()
                    Text("Connected")
                        .font(.walletMono11)
                        .foregroundStyle(.walletGreen)
                }
            }

            Section("About") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text("1.0.0")
                        .foregroundStyle(.walletMuted)
                }
            }
        }
        .navigationTitle("Settings")
        .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }
}
#endif
