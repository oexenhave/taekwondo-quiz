# Taekwondo Quiz - Design Specifications

**Last Updated**: 2025-11-06
**Status**: Ready for Implementation

---

## User Flow Overview

```
Setup Screen → Quiz Screen (N questions) → Results Screen
     ↓              ↓                           ↓
  Configure    Answer questions            Review & restart
```

---

## 1. Setup Screen

### Components
- **Belt Level Selector** (Dropdown)
  - Options: 10. kup, 9. kup, 8. kup, 7. kup, 6. kup, 5. kup, 4. kup, 3. kup, 2. kup, 1. kup, 1. dan, 2. dan, 3. dan
  - Label: "Test til:" (Danish)

- **Number of Questions** (4 button options)
  - Options: 10, 25, 50, 100
  - Label: "Antal spørgsmål:" (Danish)

- **Start Button**
  - Text: "Start test" (Danish)

### Layout
```
┌─────────────────────────────┐
│   Seung Li Taekwondo Quiz   │
├─────────────────────────────┤
│   Test til:                 │
│   [Dropdown: 10. kup ▼]     │
│                             │
│   Antal spørgsmål:          │
│   [10] [25] [50] [100]      │
│                             │
│   [     Start test     ]    │
└─────────────────────────────┘
```

---

## 2. Question Selection Algorithm

### Distribution Strategy
Questions are selected from current and previous belt levels using adaptive percentages:

#### If 4+ previous levels exist:
- **50%** from current level
- **30%** from level -1
- **10%** from level -2
- **5%** from level -3
- **5%** from level -4

#### If 2-3 previous levels exist:
- **60%** from current level
- **25%** from level -1
- **15%** from level -2 (if exists)
- Remaining to level -3 (if exists)

#### If 0-1 previous levels exist:
- Redistribute proportionally among available levels

### Examples
- **Testing 10_kup**: 100% from 10_kup
- **Testing 9_kup**: 70% from 9_kup, 30% from 10_kup
- **Testing 8_kup**: 60% from 8_kup, 25% from 9_kup, 15% from 10_kup
- **Testing 5_kup (20 questions)**: 10 from 5_kup, 6 from 6_kup, 2 from 7_kup, 1 from 8_kup, 1 from 9_kup

### Multi-Level Backfill Logic
1. Calculate distribution using percentages (round down)
2. Sum allocated questions
3. **If total < requested**: Progressively fill from all belt levels
   - Start from current level
   - Move to level -1, level -2, etc.
   - Take remaining available questions from each level
   - Stop when requested count reached OR all levels exhausted
4. Ensure no duplicates (Set-based tracking)

**Critical**: Final question count NEVER exceeds requested value. May be less if insufficient questions available across all levels.

---

## 3. Quiz Screen

### Layout
```
┌─────────────────────────────┐
│   Spørgsmål 5/20            │ ← Progress
├─────────────────────────────┤
│                             │
│   Hvad er "Apchagi" på      │ ← Question
│   dansk?                    │
│                             │
├─────────────────────────────┤
│   [  Front spark  ]         │ ← Answer 1
│   [  Side spark   ]         │ ← Answer 2
│   [  Rundspark    ]         │ ← Answer 3
│   [  Bagud spark  ]         │ ← Answer 4
├─────────────────────────────┤
│   [      Næste      ]       │ ← Next (hidden until answered)
└─────────────────────────────┘
```

### Question Types

#### Vocabulary Questions
- **Bidirectional**: Randomly select ko→da OR da→ko direction
- **Format**: "Hvad er '[source]' på [target language]?"
  - ko→da: "Hvad er 'Apchagi' på dansk?"
  - da→ko: "Hvad er 'Front spark' på koreansk?"

#### Theory Questions
- **Language**: Danish (MVP)
- **Format**: Display question text as-is from data

### Answer Generation

#### For Vocabulary:
- If `incorrectAnswers[targetLang]` exists → use them
- If empty → randomly select 3 from:
  1. Same category (preferred)
  2. Same belt rank (if insufficient)
  3. Adjacent lower belt ranks (if still insufficient)
- Always shuffle answer positions
- Ensure no duplicates

#### For Theory:
- Use provided `incorrectAnswers[lang]`
- If fewer than needed → don't include the question at all
- Always shuffle answer positions
- **Support 2-4 total options** (1 correct + 1-3 incorrect)

### User Interaction Flow

1. **Initial State**
   - Question displayed
   - 2-4 answer buttons enabled
   - Next button hidden

2. **User Clicks Answer**
   - Disable all answer buttons
   - Apply visual feedback:
     - **Correct answer** → Green background
     - **User's wrong answer** → Red background (if incorrect)
   - If correct → Trigger confetti animation
   - Show Next button

3. **User Clicks Next**
   - Load next question
   - Reset to Initial State

### Visual Feedback Rules
- **Correct answer selected**: Green button + confetti
- **Incorrect answer selected**:
  - User's choice → Red
  - Correct answer → Green
- All buttons disabled after selection
- Next button appears after answer selected

### Progress Indicator
- Format: "Spørgsmål X/Y" (Danish)
- Display at top of quiz card

---

## 4. Results Screen

### Layout
```
┌─────────────────────────────┐
│   Resultat                  │
├─────────────────────────────┤
│                             │
│        18 / 20              │
│         90%                 │
│                             │
│   Fremragende! Du er en     │
│   Taekwondo mester!         │
│                             │
├─────────────────────────────┤
│   [      Prøv igen     ]    │
└─────────────────────────────┘
```

### Performance Messages (Danish)

| Score Range | Message |
|-------------|---------|
| 90-100% | "Fremragende! Du er en Taekwondo mester!" |
| 70-89% | "Godt gået! Bliv ved med at øve!" |
| 50-69% | "God indsats! Gennemgå og prøv igen." |
| Below 50% | "Bliv ved! Øvelse gør mester." |

### Actions
- **"Prøv igen" button**: Returns to Setup Screen

---

## 5. Danish Translations

### UI Elements
| English | Danish |
|---------|--------|
| Test for | Test til |
| Number of questions | Antal spørgsmål |
| Start test | Start test |
| Question X/Y | Spørgsmål X/Y |
| Next | Næste |
| Result | Resultat |
| Try again | Prøv igen |
| What is '[term]' in Danish? | Hvad er '[term]' på dansk? |
| What is '[term]' in Korean? | Hvad er '[term]' på koreansk? |

### Belt Levels
Displayed as-is from metadata: "10. kup", "9. kup", etc.

---

## 6. Visual Design Guidelines

### Colors (Material UI Theme)
- **Primary**: #1976d2 (Blue - Material UI default)
- **Correct**: Green (#4caf50)
- **Incorrect**: Red (#f44336)
- **Background**: White (#ffffff)

### Button Sizes
- **Answer buttons**: Large, touch-friendly (minimum 48px height)
- **Full width** on mobile
- **Adequate spacing** between buttons (8-16px)

### Typography
- **Question text**: Typography variant="h6" or h5
- **Answer buttons**: Button size="large"
- **Results score**: Typography variant="h3"

### Animations
- **Confetti**: Triggered on correct answer using canvas-confetti library
- **Button states**: Material UI default hover/active states

### Responsive Design
- Mobile-first approach
- Maximum content width: 600px (centered on desktop)
- Touch targets: Minimum 48x48px
- Ample whitespace for readability

---

## 7. Technical Implementation Notes

### State Management
- Quiz state managed by custom hook `useQuiz.js`
- Track: current question, score, answered questions, quiz configuration

### Data Flow
1. Setup screen → Set belt level + question count
2. quizLogic.js → Select questions based on algorithm
3. answerGenerator.js → Generate randomized answer options
4. Quiz component → Display questions one by one
5. Results component → Show final score

### Files to Create
- `src/components/Setup.jsx` - Setup screen
- `src/components/Quiz.jsx` - Main quiz container
- `src/components/QuizCard.jsx` - Single question display
- `src/components/Results.jsx` - Results screen
- `src/utils/quizLogic.js` - Question selection algorithm
- `src/utils/answerGenerator.js` - Answer randomization
- `src/hooks/useQuiz.js` - Quiz state management
- `src/App.jsx` - Main app routing

---

## 8. Edge Cases to Handle

1. **Insufficient questions**: If requested count > available questions
   - Multi-level backfill attempts to fill from all belt levels
   - User receives maximum available questions (≤ requested)
   - No warning displayed

2. **No previous levels**: First belt rank (10_kup)
   - Use 100% from current level

3. **Empty incorrect answers**:
   - Generate random alternatives from pool
   - Ensure no duplicates with correct answer

4. **Theory questions with <4 options**:
   - Display only available options (2-4 buttons)
   - UI must adapt to variable button count

---

**Next Steps**: Implement Phase 3 (Core Quiz Logic) and Phase 4 (UI Components)
