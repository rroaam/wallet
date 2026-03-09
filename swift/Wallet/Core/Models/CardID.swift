import Foundation

enum CardID: String, Codable, CaseIterable, Identifiable {
    case identity
    case voice
    case expertise
    case currentWork
    case audience
    case aesthetic
    case narrative
    case goals

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .identity:    return "Identity"
        case .voice:       return "Voice"
        case .expertise:   return "Expertise"
        case .currentWork: return "Current Work"
        case .audience:    return "Audience"
        case .aesthetic:   return "Aesthetic"
        case .narrative:   return "Narrative"
        case .goals:       return "Goals"
        }
    }

    var icon: String {
        switch self {
        case .identity:    return "person.fill"
        case .voice:       return "waveform"
        case .expertise:   return "brain.head.profile"
        case .currentWork: return "hammer.fill"
        case .audience:    return "person.2.fill"
        case .aesthetic:   return "paintpalette.fill"
        case .narrative:   return "book.fill"
        case .goals:       return "flag.fill"
        }
    }

    var tag: String {
        switch self {
        case .identity:    return "ID"
        case .voice:       return "VO"
        case .expertise:   return "EX"
        case .currentWork: return "CW"
        case .audience:    return "AU"
        case .aesthetic:   return "AE"
        case .narrative:   return "NA"
        case .goals:       return "GO"
        }
    }

    var prompt: String {
        switch self {
        case .identity:    return "Who are you? Name, role, elevator pitch, how you want to be perceived."
        case .voice:       return "How do you sound? Cadence, vocabulary, adjectives you use, what to never say."
        case .expertise:   return "What do you know deeply? Credentials, strong POVs, knowledge areas."
        case .currentWork: return "What are you working on right now? Active projects, sprint focus, recent decisions."
        case .audience:    return "Who do you talk to? Their fears, motivations, why they care about your work."
        case .aesthetic:   return "What feels right visually? Design principles, references, visual identity."
        case .narrative:   return "What's your story? Origin, company thesis, why you, why now."
        case .goals:       return "What's the north star this quarter? One sentence, not OKRs."
        }
    }

    var surfacesWhen: String {
        switch self {
        case .identity:    return "New conversation, cold context"
        case .voice:       return "Writing emails, posts, docs"
        case .expertise:   return "Answering questions, thought leadership"
        case .currentWork: return "Notion, Linear, project tools"
        case .audience:    return "Writing copy, pitches, emails"
        case .aesthetic:   return "Figma, Canva, design tools"
        case .narrative:   return "Investor emails, LinkedIn, pitches"
        case .goals:       return "Planning, strategy, prioritization"
        }
    }
}
