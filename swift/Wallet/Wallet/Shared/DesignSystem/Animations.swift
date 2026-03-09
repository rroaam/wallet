import SwiftUI

extension Animation {
    static let walletSpring = Animation.spring(response: 0.3, dampingFraction: 0.85)
    static let walletSnappy = Animation.easeOut(duration: 0.2)
    static let walletFade   = Animation.easeOut(duration: 0.15)
}
