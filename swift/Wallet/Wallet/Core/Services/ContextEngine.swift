#if os(macOS)
import AppKit
import SwiftUI

enum WalletState: Equatable {
    case idle
    case injecting
    case trayOpen
}

@Observable
final class ContextEngine {
    var activeCards: [CardID] = []
    var detectedApp: DetectedApp = .unknown
    var state: WalletState = .idle

    private var cardStore: CardStore

    init(cardStore: CardStore) {
        self.cardStore = cardStore
    }

    func startObserving() {
        NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.didActivateApplicationNotification,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            self?.handleAppActivation(notification)
        }
    }

    func stopObserving() {
        NSWorkspace.shared.notificationCenter.removeObserver(self)
    }

    private func handleAppActivation(_ notification: Notification) {
        guard let app = notification.userInfo?[NSWorkspace.applicationUserInfoKey] as? NSRunningApplication,
              let bundleID = app.bundleIdentifier
        else { return }

        let detected = DetectedApp(bundleID: bundleID)

        // Don't inject when switching to ourselves
        guard detected != .unknown || bundleID != Bundle.main.bundleIdentifier else { return }

        detectedApp = detected
        let relevantIDs = detected.relevantCards
        activeCards = relevantIDs

        // Get full card data and inject
        let cards = cardStore.activeCards(for: detected)
        guard !cards.isEmpty else { return }

        state = .injecting
        InjectionService.inject(cards: cards, for: detected)
        cardStore.markInjected(relevantIDs)

        // Revert state after 3 seconds
        Task { @MainActor in
            try? await Task.sleep(for: .seconds(3))
            if state == .injecting {
                state = .idle
            }
        }
    }
}
#endif
