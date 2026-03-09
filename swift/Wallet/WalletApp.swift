import SwiftUI

@main
struct WalletApp: App {
    #if os(macOS)
    @State private var cardStore = CardStore()
    @State private var contextEngine: ContextEngine?

    var body: some Scene {
        MenuBarExtra {
            Text("Wallet — SwiftUI version (requires Xcode to build)")
                .padding()
        } label: {
            Image(systemName: "rectangle.stack.fill")
        }
    }
    #else
    @State private var cardStore = CardStore()

    var body: some Scene {
        WindowGroup {
            Text("Wallet iOS — requires Xcode to build")
                .preferredColorScheme(.dark)
        }
    }
    #endif
}
