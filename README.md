# Taekwondo Theory Quiz

A Progressive Web App (PWA) quiz application for Taekwondo students to practice theory and terminology. Built with React + Material UI with Duolingo-style one question, four options interface.

## Features

- **Adaptive Question Selection**: Intelligent distribution algorithm that includes current belt level and all previous levels
- **Bidirectional Vocabulary**: Korean ↔ Danish translation practice
- **Theory Questions**: Knowledge-based questions with multiple choice answers
- **Visual Feedback**: Confetti animation for correct answers
- **Offline Support**: Works offline as installable PWA
- **Responsive Design**: Mobile-first design that works on all devices

## Dataset

- **264 vocabulary questions** across all belt ranks (10. kup → 3. dan)
- **56 theory questions** (1.-3. dan)
- All vocabulary includes Korean, Danish, and English translations
- Complete coverage of 10. kup through 3. dan

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Management Scripts

### Add New Questions

Add vocabulary question:
```bash
python3 add_question.py vocab --belt BELT_RANK --category CATEGORY \
  --korean "KOREAN" --danish "DANISH" --english "ENGLISH"
```

Add theory question:
```bash
python3 add_question.py theory --belt BELT_RANK \
  --question "QUESTION_TEXT" --correct "CORRECT_ANSWER" \
  --incorrect "WRONG_1" --incorrect "WRONG_2" --incorrect "WRONG_3"
```

Examples:
```bash
# Add vocabulary
python3 add_question.py vocab --belt 8_kup --category theory_terms \
  --korean "Tasut" --danish "Fem (5)" --english "Five (5)"

# Add theory question
python3 add_question.py theory --belt 1_dan \
  --question 'Hvad symboliserer GWE'"'"'en til "Taegeuk Il Jang"?' \
  --correct "Himmeriget/lyset (Keon)" \
  --incorrect "Glæde/flod (Tae)" --incorrect "Ild/solen (Ri)" --incorrect "Torden (Jin)"
```

### Match IDs in Markdown Files

Update vocabulary files (10-kup.md, 9-kup.md, etc.) with question IDs:
```bash
python3 match_vocabulary.py
```

Update theory files (additional-questions.md) with question IDs:
```bash
python3 match_theory.py
```

### Fix Belt Ranks

Corrects belt ranks in questions.json based on markdown files (which are the master source):

```bash
python3 fix_belt_ranks.py
```

### Validate Unique IDs

Ensures all question IDs are unique:

```bash
python3 validate_unique_ids.py
```

## Question Selection Algorithm

The app uses an adaptive distribution strategy:

### Distribution Strategy

- **4+ previous levels**: 50% current, 30% level-1, 10% level-2, 5% level-3, 5% level-4
- **3 previous levels**: 60% current, 25% level-1, 10% level-2, 5% level-3
- **2 previous levels**: 60% current, 25% level-1, 15% level-2
- **1 previous level**: 70% current, 30% level-1
- **0 previous levels**: 100% current

### Multi-Level Backfill

If the initial distribution doesn't provide enough questions, the algorithm progressively fills from all included belt levels (current → previous → earlier) to maximize available questions while never exceeding the requested count.

## Tech Stack

- **React** - UI framework
- **Material UI** - Component library
- **Vite** - Build tool
- **PWA** - Progressive Web App support with offline capabilities

## Project Structure

```
src/
├── components/       # React components
│   ├── Setup.jsx    # Belt level and question count selection
│   ├── Quiz.jsx     # Main quiz container
│   └── Results.jsx  # Results screen
├── hooks/           # Custom React hooks
│   └── useQuiz.js   # Quiz state management
├── utils/           # Utility functions
│   ├── quizLogic.js        # Question selection algorithm
│   └── answerGenerator.js  # Answer randomization
└── data/
    └── questions.json      # Complete question dataset
```

## Data Model

See [CLAUDE.md](./CLAUDE.md) for complete data model documentation and project guidelines.

## License

Proprietary - All rights reserved
