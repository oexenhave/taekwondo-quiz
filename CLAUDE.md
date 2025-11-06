# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Progressive Web App (PWA) quiz application for Taekwondo students to practice theory and terminology. Think Duolingo-style: one question, four options, one correct answer.

**Tech Stack**: React + Material UI + PWA configuration

## Application Goals

### MVP Features (First Iteration)
- Duolingo-style quiz interface: single question with 4 multiple choice options
- Two question types with separate data structures:
  - **Vocabulary**: Bidirectional translation between Korean ↔ Danish (e.g., "What is 'Apchagi' in Danish?" or "What is 'Front spark' in Korean?")
  - **Theory**: Knowledge-based questions in Danish with multiple choice (e.g., "What does the Keumgang symbol represent?")
- Sprinkle/confetti animation on correct answers
- Personal ranking/score after completing a set number of questions
- Works offline as PWA (installable on iOS, Android, desktop)
- **No persistence, no user management, no backend in MVP**
- **Language support**: Danish and Korean in MVP, data structure prepared for English

### Data Model Strategy
- Use normalized identifiers for belt ranks (`10_kup`, `1_dan`) and categories (`leg_techniques`, `stances`)
- Store translations in centralized metadata structure for consistency
- Support both explicit incorrect answers AND random generation:
  - If incorrect answers are specified → use them
  - If not specified → randomly pick from similar categories (e.g., other techniques in same belt rank/category)
- Structure accommodates future customization of incorrect answers

### Data Source
Complete dataset in `questions.json`:
- **217 vocabulary questions** across all belt ranks (10. kup → 3. dan)
- **44 theory questions** (1.-3. dan)
- All vocabulary includes Korean, Danish, and English translations
- Theory questions in Danish (prepared for English)

To regenerate or update the dataset, run: `python3 convert_xml_to_json.py`

## JSON Data Model

Separate structures for vocabulary and theory questions with English field names:

### Metadata Structure
Centralized translations for belt ranks and categories:

```json
{
  "metadata": {
    "beltRanks": {
      "10_kup": { "da": "10. kup", "en": "10th kup" },
      "9_kup": { "da": "9. kup", "en": "9th kup" },
      "8_kup": { "da": "8. kup", "en": "8th kup" },
      "7_kup": { "da": "7. kup", "en": "7th kup" },
      "6_kup": { "da": "6. kup", "en": "6th kup" },
      "5_kup": { "da": "5. kup", "en": "5th kup" },
      "4_kup": { "da": "4. kup", "en": "4th kup" },
      "3_kup": { "da": "3. kup", "en": "3rd kup" },
      "2_kup": { "da": "2. kup", "en": "2nd kup" },
      "1_kup": { "da": "1. kup", "en": "1st kup" },
      "1_dan": { "da": "1. dan", "en": "1st dan" },
      "2_dan": { "da": "2. dan", "en": "2nd dan" },
      "3_dan": { "da": "3. dan", "en": "3rd dan" }
    },
    "categories": {
      "stances": { "da": "Stande", "en": "Stances" },
      "hand_techniques": { "da": "Håndteknikker", "en": "Hand Techniques" },
      "leg_techniques": { "da": "Benteknikker", "en": "Leg Techniques" },
      "theory_terms": { "da": "Teori", "en": "Theory Terms" },
      "miscellaneous": { "da": "Diverse", "en": "Miscellaneous" }
    }
  }
}
```

### Vocabulary Questions
Multi-language support with bidirectional translation (e.g., Korean→Danish, Danish→Korean):

```json
{
  "vocabularyQuestions": [
    {
      "id": "vocab-10kup-leg_techniques-001",
      "beltRank": "10_kup",  // Reference to metadata.beltRanks
      "category": "leg_techniques",  // Reference to metadata.categories
      "translations": {
        "ko": "Apchagi",
        "da": "Front spark",
        "en": "Front kick"  // English translation included
      },
      "incorrectAnswers": {
        "da": [],  // Optional: if empty, generate randomly when asking ko→da
        "ko": [],  // Optional: if empty, generate randomly when asking da→ko
        "en": []   // Optional: if empty, generate randomly when asking ko→en
      }
    }
  ]
}
```

**Language codes**:
- `ko` = Korean (romanized)
- `da` = Danish
- `en` = English (future)

**Normalized identifiers**:
- Belt ranks use underscore format: `10_kup`, `9_kup`, ..., `1_kup`, `1_dan`, `2_dan`, etc.
- Categories use English snake_case: `stances`, `hand_techniques`, `leg_techniques`, `theory_terms`, `miscellaneous`
- All questions reference these identifiers, with translations provided via metadata
- This ensures consistency and makes it easy to filter/query questions by rank or category

### Theory Questions
Multi-language support for theory questions:

```json
{
  "theoryQuestions": [
    {
      "id": "theory-1dan-001",
      "beltRank": "1_dan",  // Reference to metadata.beltRanks
      "question": {
        "da": "Hvad hedder alle farvede bælter, 9.-1. kup?",
        "en": null  // Prepared for future English translation
      },
      "correctAnswer": {
        "da": "Yu Kup Ja",
        "en": null
      },
      "incorrectAnswers": {
        "da": ["Yu Kup Nim", "Cho Kup Ja"], // Can have 1-3 incorrect answers; UI supports 2-4 total options
        "en": []
      }
    }
  ]
}
```

**Note**: Theory questions may have 2-4 answer options total (1 correct + 1-3 incorrect). The UI must adapt to display the available options without always requiring exactly 4 choices.

### Complete Data Structure
The final JSON structure combining all elements:

```json
{
  "metadata": {
    "beltRanks": { ... },
    "categories": { ... }
  },
  "vocabularyQuestions": [ ... ],
  "theoryQuestions": [ ... ]
}
```

**Answer Generation Logic**:
- **Vocabulary**:
  - App randomly selects source→target language pair (e.g., ko→da or da→ko)
  - If `incorrectAnswers[targetLanguage]` is empty → randomly select 3 translations in target language from same `category` (or nearby belt ranks if insufficient)
  - Question format: "What is '[source term]' in [target language]?"

- **Theory**:
  - Present question in user's selected language (Danish in MVP, English in future)
  - If `incorrectAnswers[language]` is empty or has fewer than 3 → randomly select from other correct answers in same/nearby belt ranks

- Always ensure no duplicate answers in the final 4 options
- Shuffle answer positions before displaying

## Git Workflow

This project uses **Conventional Commits** for clear, semantic commit messages.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Common Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without changing functionality
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (dependencies, tooling)
- `build`: Build system or external dependencies
- `ci`: CI/CD configuration changes
- `perf`: Performance improvements

### Examples
```bash
feat: add vocabulary question component
fix: correct answer shuffling logic
docs: update CLAUDE.md with git workflow
chore: install material-ui dependencies
refactor: extract answer generation to separate utility
```

### Workflow
1. Make changes
2. Stage files: `git add .`
3. Commit with conventional format: `git commit -m "type: description"`
4. Push to remote: `git push`

## Development Commands

TBD - Will be added as the project scaffolding is created.

Expected:
- `npm install` - Install dependencies
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Implementation Notes

### PWA Requirements
- Service worker for offline functionality
- Web app manifest for installation
- Responsive design (mobile-first)
- Touch-friendly UI (large tap targets)

### Quiz Logic
- **Vocabulary questions**: Randomly alternate between ko→da and da→ko directions for variety
- **Theory questions**: Display in user's language (Danish in MVP)
- Shuffle answer options (don't always put correct answer in same position)
- Track score during session (temporary, no persistence in MVP)
- Show sprinkle/confetti animation on correct answers (consider libraries like `react-confetti` or `canvas-confetti`)
- Display final score/ranking after N questions completed

### Answer Pool Strategy

**For Vocabulary Questions:**
The app randomly selects translation direction (ko→da or da→ko) for each question.

When `incorrectAnswers[targetLanguage]` is empty, generate 3 random incorrect options **in the target language**:
1. Pull from same `category` first (e.g., other leg techniques if question is about a leg technique)
2. If insufficient options in category, expand to same `beltRank` across categories
3. If still insufficient, expand to adjacent belt ranks
4. Always ensure no duplicate answers in the final 4 options

Example: If asking ko→da for "Apchagi", select 3 incorrect Danish translations from other leg techniques.

**For Theory Questions:**
When `incorrectAnswers[language]` is empty or has fewer than 3 options:
1. Use provided `incorrectAnswers` first
2. If more options needed, randomly select from other correct answers in same belt rank
3. If insufficient, expand to adjacent belt ranks
4. Always ensure no duplicate answers in the final 4 options

### Belt Rank Hierarchy
Progression from beginner to black belt:

`10_kup` → `9_kup` → `8_kup` → `7_kup` → `6_kup` → `5_kup` → `4_kup` → `3_kup` → `2_kup` → `1_kup` → `1_dan` → `2_dan` → `3_dan` → ...

Use this order when:
- Expanding search for incorrect answers to adjacent belt ranks
- Filtering questions by difficulty/progression level
- Displaying progress to users
