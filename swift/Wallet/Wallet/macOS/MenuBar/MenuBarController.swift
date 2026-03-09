#if os(macOS)
import AppKit
import SwiftUI

final class MenuBarController {
    private var statusItem: NSStatusItem?
    private var popover: NSPopover?
    private var contextEngine: ContextEngine
    private var cardStore: CardStore

    init(cardStore: CardStore, contextEngine: ContextEngine) {
        self.cardStore = cardStore
        self.contextEngine = contextEngine
    }

    func setup() {
        let statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        self.statusItem = statusItem

        if let button = statusItem.button {
            button.image = NSImage(
                systemSymbolName: "rectangle.stack.fill",
                accessibilityDescription: "Wallet"
            )
            button.image?.size = NSSize(width: 18, height: 18)
            button.imagePosition = .imageOnly
            button.alphaValue = 0.5
            button.action = #selector(togglePopover)
            button.target = self
        }

        let popover = NSPopover()
        popover.contentSize = NSSize(width: 320, height: 480)
        popover.behavior = .transient
        popover.animates = true

        let trayView = CardTrayView(
            cardStore: cardStore,
            contextEngine: contextEngine
        )
        popover.contentViewController = NSHostingController(rootView: trayView)
        self.popover = popover
    }

    @objc private func togglePopover() {
        guard let popover, let button = statusItem?.button else { return }

        if popover.isShown {
            popover.performClose(nil)
            contextEngine.state = .idle
            updateIconState(.idle)
        } else {
            popover.show(relativeTo: button.bounds, of: button, preferredEdge: .minY)
            contextEngine.state = .trayOpen
            updateIconState(.trayOpen)
        }
    }

    func updateIconState(_ state: WalletState) {
        guard let button = statusItem?.button else { return }

        switch state {
        case .idle:
            button.alphaValue = 0.5
            button.layer?.shadowOpacity = 0

        case .injecting:
            button.alphaValue = 1.0
            button.layer?.shadowOpacity = 0

        case .trayOpen:
            button.alphaValue = 1.0
            button.layer?.shadowColor = NSColor(Color.walletPurple).cgColor
            button.layer?.shadowRadius = 4
            button.layer?.shadowOpacity = 0.4
            button.layer?.shadowOffset = .zero
        }
    }
}
#endif
