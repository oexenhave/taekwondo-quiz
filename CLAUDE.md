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
- **269 vocabulary questions** across all belt ranks (10. kup → 3. dan)
- **39 theory questions** (1.-3. dan)
- All vocabulary includes Korean, Danish, and English translations
- Theory questions in Danish (prepared for English)
- Complete coverage of 10. kup through 1. kup (203 questions)

Master source files are in `roskilde-source/*.md` with ID mappings to questions.json.

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

### Core Commands
```bash
npm install              # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

### Version Management
```bash
npm run version-bump    # Increment major version (1→2→3)
```

**Version System:**
- Major version only (simple incrementing: v1, v2, v3...)
- Build date auto-generated at build time
- Displayed below Start button as: `v1 • Built: 2025-11-09`
- Helps verify PWA updates are deployed correctly

**Workflow:**
1. Make changes to the app
2. Run `npm run version-bump` before deploying
3. Run `npm run deploy` (auto-builds with new version)

### Deployment
```bash
npm run deploy          # Build and deploy to GitHub Pages
```

### Question Management Scripts

**Add New Question:**
```bash
python3 add_question.py --belt BELT_RANK --category CATEGORY \
  --korean "KOREAN" --danish "DANISH" --english "ENGLISH"
```

**Example:**
```bash
python3 add_question.py --belt 8_kup --category theory_terms \
  --korean "Tasut" --danish "Fem (5)" --english "Five (5)"
```

**Valid Parameters:**
- Belt ranks: `10_kup`, `9_kup`, `8_kup`, `7_kup`, `6_kup`, `5_kup`, `4_kup`, `3_kup`, `2_kup`, `1_kup`, `1_dan`, `2_dan`, `3_dan`
- Categories: `stances`, `hand_techniques`, `leg_techniques`, `theory_terms`, `miscellaneous`

**Match Korean IDs:**
```bash
python3 match_korean_ids.py    # Updates markdown files with IDs from questions.json
```

**Fix Belt Ranks:**
```bash
python3 fix_belt_ranks.py      # Corrects belt ranks based on markdown files (master source)
```

**Validate Unique IDs:**
```bash
python3 validate_unique_ids.py # Ensures all question IDs are unique
```

## Key Implementation Notes

### PWA Requirements
- Service worker for offline functionality
- Web app manifest for installation
- Responsive design (mobile-first)
- Touch-friendly UI (large tap targets)

### Branding
- **Logo**: `public/rtk-logo.jpg` - Displayed above title on Setup screen
- **App Name**: "Seung Li Taekwondo Quiz" (configurable in vite.config.js manifest)
- Logo centered, max-width 200px, responsive scaling

### Quiz Logic
- **Vocabulary questions**: Randomly alternate between ko→da and da→ko directions for variety
- **Theory questions**: Display in user's language (Danish in MVP)
- Shuffle answer options (don't always put correct answer in same position)
- Track score during session (temporary, no persistence in MVP)
- Show sprinkle/confetti animation on correct answers using `canvas-confetti`
- Display final score/ranking after N questions completed

### Question Selection Algorithm

**Adaptive Distribution Strategy:**
- Includes current belt level and ALL previous levels
- Uses percentage-based distribution:
  - **4+ previous levels**: 50% current, 30% level-1, 10% level-2, 5% level-3, 5% level-4
  - **3 previous levels**: 60% current, 25% level-1, 10% level-2, 5% level-3
  - **2 previous levels**: 60% current, 25% level-1, 15% level-2
  - **1 previous level**: 70% current, 30% level-1
  - **0 previous levels**: 100% current

**Multi-Level Backfill:**
If initial distribution doesn't meet requested count:
1. Calculate shortage (requested - selected)
2. Iteratively fill from all belt levels (current → level-1 → level-2 → ...)
3. Take remaining available questions from each level
4. Stop when requested count reached OR all levels exhausted
5. Use Set-based tracking to prevent duplicates

**Guarantees:**
- Final count NEVER exceeds requested amount
- May return fewer questions if insufficient available across all levels
- No warning messages displayed to user
- Prioritizes harder material (fills from current level first)

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
