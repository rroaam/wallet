#if os(iOS)
import SwiftUI

struct IOSOnboardingView: View {
    var cardStore: CardStore
    let onComplete: () -> Void

    @State private var step: Int = 0
    @State private var responses: [CardID: String] = [:]

    private let cardOrder: [CardID] = CardID.allCases

    private var currentCardID: CardID {
        cardOrder[step]
    }

    var body: some View {
        ZStack {
            // Background
            Color.walletBG.ignoresSafeArea()

            // Radial glow
            RadialGradient(
                colors: [Color.walletPurple.opacity(0.04), .clear],
                center: .center,
                startRadius: 0,
                endRadius: 400
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Progress dots
                ProgressDotsView(total: 8, current: step)
                    .padding(.top, 48)

                Spacer()

                // Floating card
                OnboardingCardView(
                    step: step,
                    cardID: currentCardID,
                    response: Binding(
                        get: { responses[currentCardID] ?? "" },
                        set: { responses[currentCardID] = $0 }
                    ),
                    onNext: advanceStep
                )
                .id(step) // Force view recreation for transition
                .transition(.asymmetric(
                    insertion: .move(edge: .trailing).combined(with: .opacity),
                    removal: .move(edge: .leading).combined(with: .opacity)
                ))
                .animation(.walletSpring, value: step)

                Spacer()
            }
        }
    }

    private func advanceStep() {
        // Save current response to card store
        if let response = responses[currentCardID],
           !response.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            if var card = cardStore.card(for: currentCardID) {
                card.content = String(response.prefix(WalletCard.maxContentLength))
                card.updatedAt = .now
                cardStore.update(card)
            }
        }

        if step < 7 {
            withAnimation(.walletSpring) {
                step += 1
            }
        } else {
            onComplete()
        }
    }
}

// MARK: - Progress Dots

struct ProgressDotsView: View {
    let total: Int
    let current: Int

    var body: some View {
        HStack(spacing: 16) {
            ForEach(0..<total, id: \.self) { index in
                Circle()
                    .fill(
                        index == current
                            ? AnyShapeStyle(Color.walletGradient)
                            : AnyShapeStyle(Color.white.opacity(0.2))
                    )
                    .frame(width: 8, height: 8)
                    .scaleEffect(index == current ? 1.2 : 1.0)
                    .animation(.walletSnappy, value: current)
            }
        }
    }
}

// MARK: - Onboarding Card

struct OnboardingCardView: View {
    let step: Int
    let cardID: CardID
    @Binding var response: String
    let onNext: () -> Void

    @State private var showSuggest = false

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            // Step counter
            Text("step \(String(format: "%02d", step + 1)) / 08")
                .font(.walletMono11)
                .foregroundStyle(.walletCyan)

            // Question
            Text(cardID.prompt)
                .font(.system(size: 24, weight: .bold))
                .foregroundStyle(.walletWhite)
                .lineSpacing(4)

            // Subtext
            Text("Surfaces when: \(cardID.surfacesWhen)")
                .font(.system(size: 14))
                .foregroundStyle(.walletMuted)

            // Text editor
            TextEditor(text: $response)
                .font(.system(size: 16))
                .scrollContentBackground(.hidden)
                .frame(minHeight: 80)
                .padding(12)
                .background(Color.walletSurface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color.walletBorder, lineWidth: 1)
                )

            // AI suggest chip (appears after 3s if empty)
            if showSuggest && response.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                AISuggestChip(text: "Suggest content →") {
                    // TODO: Claude API call
                }
            }

            // Next button
            HStack {
                Spacer()
                Button(action: onNext) {
                    Text(step < 7 ? "Looks good →" : "Finish →")
                        .font(.walletSemi)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                        .background(Color.walletGradient)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
            }
        }
        .padding(28)
        .frame(maxWidth: 480)
        .glassCard(radius: 20)
        .padding(.horizontal, 20)
        .onAppear {
            showSuggest = false
            Task {
                try? await Task.sleep(for: .seconds(3))
                showSuggest = true
            }
        }
    }
}
#endif
