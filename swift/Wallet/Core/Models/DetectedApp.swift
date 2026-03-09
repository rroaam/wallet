import Foundation

enum DetectedApp: String, Codable {
    case claude
    case chatgpt
    case notion
    case figma
    case linear
    case mail
    case outlook
    case superhuman
    case cursor
    case xcode
    case vscode
    case unknown

    init(bundleID: String) {
        switch bundleID {
        case "com.anthropic.claude",
             "com.anthropic.claudefordesktop":
            self = .claude
        case "com.openai.chat":
            self = .chatgpt
        case "notion.id":
            self = .notion
        case "com.figma.Desktop":
            self = .figma
        case "com.linear":
            self = .linear
        case "com.apple.mail":
            self = .mail
        case "com.microsoft.Outlook":
            self = .outlook
        case "com.superhuman.electron":
            self = .superhuman
        case "com.todesktop.230313mzl4w4u92":
            self = .cursor
        case "com.apple.dt.Xcode":
            self = .xcode
        case "com.microsoft.VSCode":
            self = .vscode
        default:
            self = .unknown
        }
    }

    var displayName: String {
        switch self {
        case .claude:    return "Claude"
        case .chatgpt:   return "ChatGPT"
        case .notion:    return "Notion"
        case .figma:     return "Figma"
        case .linear:    return "Linear"
        case .mail:      return "Mail"
        case .outlook:   return "Outlook"
        case .superhuman: return "Superhuman"
        case .cursor:    return "Cursor"
        case .xcode:     return "Xcode"
        case .vscode:    return "VS Code"
        case .unknown:   return "Unknown"
        }
    }

    var relevantCards: [CardID] {
        switch self {
        case .claude:                       return [.voice, .identity, .narrative]
        case .chatgpt:                      return [.voice, .identity, .expertise]
        case .notion:                       return [.currentWork, .voice, .audience]
        case .figma:                        return [.aesthetic, .currentWork]
        case .linear:                       return [.currentWork, .goals]
        case .mail, .outlook, .superhuman:  return [.voice, .identity, .audience]
        case .cursor, .xcode, .vscode:      return [.currentWork, .expertise]
        case .unknown:                      return [.identity]
        }
    }
}
