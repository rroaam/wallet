#if os(macOS)
import SwiftUI

struct CardEditorView: View {
    let card: WalletCard
    let onSave: (WalletCard) -> Void

    @State private var draft: String = ""
    @State private var isGenerating = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                Image(systemName: card.icon)
                    .font(.system(size: 16))
                    .foregroundStyle(.walletPurple)

                Text(card.name)
                    .font(.walletH2)
                    .foregroundStyle(.walletWhite)

                Spacer()

                Button(action: { dismiss() }) {
                    Image(systemName: "xmark")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.walletMuted)
                }
                .buttonStyle(.plain)
            }

            // Prompt hint
            Text(card.id.prompt)
                .font(.walletCaption)
                .foregroundStyle(.walletMuted)

            // Editor
            TextEditor(text: $draft)
                .font(.system(size: 14))
                .scrollContentBackground(.hidden)
                .padding(8)
                .background(Color.walletSurface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.walletBorder, lineWidth: 1)
                )
                .frame(minHeight: 120)

            // AI suggest
            if !isGenerating {
                AISuggestChip {
                    isGenerating = true
                    // TODO: Claude API call for card suggestion
                }
            }

            // Footer
            HStack {
                // Char count
                Text("\(draft.count) / \(WalletCard.maxContentLength)")
                    .font(.walletMono10)
                    .foregroundStyle(
                        draft.count > WalletCard.maxContentLength
                            ? .walletAmber
                            : .walletMuted
                    )

                Spacer()

                // Save
                Button(action: saveCard) {
                    Text("Save")
                        .font(.walletSemi)
                        .foregroundStyle(.white)
                        .padding(.horizontal, 20)
                        .padding(.vertical, 8)
                        .background(Color.walletGradient)
                        .clipShape(Capsule())
                }
                .buttonStyle(.plain)
                .disabled(draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            }
        }
        .padding(20)
        .frame(width: 360, minHeight: 280)
        .background(Color.walletPanel)
        .clipShape(RoundedRectangle(cornerRadius: 20))
        .onAppear {
            draft = card.content
        }
    }

    private func saveCard() {
        var updated = card
        updated.content = String(draft.prefix(WalletCard.maxContentLength))
        updated.updatedAt = .now
        onSave(updated)
    }
}

#Preview {
    CardEditorView(card: CardStore.mockCards()[0]) { _ in }
        .background(Color.walletBG)
}
#endif
