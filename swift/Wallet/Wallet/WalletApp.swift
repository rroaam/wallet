import SwiftUI

@main
struct WalletApp: App {
    #if os(macOS)
    @State private var cardStore = CardStore()
    @State private var contextEngine: ContextEngine?
    @State private var menuBarController: MenuBarController?

    var body: some Scene {
        // Menu bar only — no window
        MenuBarExtra {
            CardTrayView(
                cardStore: cardStore,
                contextEngine: contextEngine ?? ContextEngine(cardStore: cardStore)
            )
            .frame(width: 320, height: 480)
            .background(Color.walletBG)
        } label: {
            Image(systemName: "rectangle.stack.fill")
        }
        .menuBarExtraStyle(.window)
        .defaultSize(width: 320, height: 480)

        Settings {
            SettingsView(cardStore: cardStore)
        }
    }

    init() {
        let store = CardStore()
        _cardStore = State(initialValue: store)
        let engine = ContextEngine(cardStore: store)
        _contextEngine = State(initialValue: engine)
        engine.startObserving()
    }
    #else
    @State private var cardStore = CardStore()
    @State private var hasCompletedOnboarding = UserDefaults.standard.bool(forKey: "wallet_onboarding_complete")

    var body: some Scene {
        WindowGroup {
            if hasCompletedOnboarding {
                IOSHomeView(cardStore: cardStore)
                    .preferredColorScheme(.dark)
            } else {
                IOSOnboardingView(cardStore: cardStore) {
                    UserDefaults.standard.set(true, forKey: "wallet_onboarding_complete")
                    hasCompletedOnboarding = true
                }
                .preferredColorScheme(.dark)
            }
        }
    }
    #endif
}

// MARK: - macOS Settings

#if os(macOS)
struct SettingsView: View {
    var cardStore: CardStore

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Wallet Settings")
                .font(.walletH1)
                .foregroundStyle(.walletWhite)

            GroupBox("Context Engine") {
                VStack(alignment: .leading, spacing: 8) {
                    Toggle("Ambient injection", isOn: .constant(true))
                    Toggle("MCP server", isOn: .constant(true))
                    Text("Keyboard shortcut: ⌘⇧W")
                        .font(.walletMono11)
                        .foregroundStyle(.walletMuted)
                }
                .padding(8)
            }

            GroupBox("Cards") {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(cardStore.cards) { card in
                        HStack {
                            Image(systemName: card.icon)
                                .frame(width: 20)
                            Text(card.name)
                            Spacer()
                            Text(card.isEmpty ? "Empty" : "\(card.content.count) chars")
                                .font(.walletMono10)
                                .foregroundStyle(.walletMuted)
                        }
                        .font(.walletBody)
                    }
                }
                .padding(8)
            }

            Spacer()
        }
        .padding(24)
        .frame(width: 400, height: 500)
        .background(Color.walletBG)
        .preferredColorScheme(.dark)
    }
}
#endif
