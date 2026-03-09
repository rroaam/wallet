#if os(iOS)
import SwiftUI

struct IOSCardEditorView: View {
    let card: WalletCard
    let onSave: (WalletCard) -> Void

    @State private var draft: String = ""
    @State private var isGenerating = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                // Prompt hint
                Text(card.id.prompt)
                    .font(.walletCaption)
                    .foregroundStyle(.walletMuted)
                    .padding(.horizontal, 20)

                // Editor
                TextEditor(text: $draft)
                    .font(.system(size: 16))
                    .scrollContentBackground(.hidden)
                    .padding(12)
                    .background(Color.walletSurface)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.walletBorder, lineWidth: 1)
                    )
                    .padding(.horizontal, 20)

                // AI suggest + char count
                HStack {
                    AISuggestChip {
                        isGenerating = true
                        // TODO: Claude API call
                    }

                    Spacer()

                    Text("\(draft.count) / \(WalletCard.maxContentLength)")
                        .font(.walletMono10)
                        .foregroundStyle(
                            draft.count > WalletCard.maxContentLength
                                ? .walletAmber
                                : .walletMuted
                        )
                }
                .padding(.horizontal, 20)

                Spacer()
            }
            .padding(.top, 16)
            .background(Color.walletBG)
            .navigationTitle(card.name)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(.ultraThinMaterial, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(.walletMuted)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") { saveCard() }
                        .foregroundStyle(.walletCyan)
                        .fontWeight(.semibold)
                        .disabled(draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
        .onAppear {
            draft = card.content
        }
    }

    private func saveCard() {
        var updated = card
        updated.content = String(draft.prefix(WalletCard.maxContentLength))
        updated.updatedAt = .now
        onSave(updated)
        dismiss()
    }
}
#endif
