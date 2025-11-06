# Taekwondo Quiz PWA - Development Plan

**Project**: Duolingo-style quiz application for Taekwondo theory practice
**Tech Stack**: React + Vite + Material UI + PWA
**Timeline**: 2-3 days for MVP
**Status**: Planning Complete ✅

---

## 🎯 MVP Features

- Single question with 2-4 multiple choice options (flexible)
- Bidirectional vocabulary (Korean ↔ Danish)
- Theory questions with multiple choice
- Confetti animation on correct answers
- Personal ranking/score after quiz completion
- Offline-capable PWA (installable on iOS/Android/Desktop)
- No persistence, no user management, no backend

---

## 📋 Development Phases

### Phase 1: Project Setup

#### Task 1.1: Initialize React Project with Vite
```bash
npm create vite@latest taekwondo-quiz -- --template react
cd taekwondo-quiz
npm install
```

#### Task 1.2: Install Dependencies
```bash
# Material UI
npm install @mui/material @emotion/react @emotion/styled

# Confetti animation
npm install canvas-confetti

# PWA plugin for Vite
npm install -D vite-plugin-pwa
```

#### Task 1.3: Set Up Folder Structure
```
src/
  components/
    Quiz.jsx
    QuizCard.jsx
    Results.jsx
  data/
    questions.json
  utils/
    quizLogic.js
    answerGenerator.js
  hooks/
    useQuiz.js
  App.jsx
  main.jsx
public/
  icons/
    icon-192x192.png
    icon-512x512.png
  manifest.json
```

**Deliverable**: Clean project structure with all dependencies installed

---

### Phase 2: Data Conversion

#### Task 2.1: Convert XML to JSON (Claude does this)
- Parse `teori_CV_kup.xml` and `teori_CV_dan_extra.xml`
- Extract all vocabulary terms (ord elements) with Korean/Danish translations
- Extract all theory questions (spoergsmaal elements) with answers
- Generate unique IDs for each question
- Map Danish categories → English identifiers
- Normalize belt ranks to underscore format (`10_kup`, `1_dan`)
- Build metadata structure with translations
- Create `questions.json` following the data model from CLAUDE.md

**Deliverable**: `src/data/questions.json` with complete question set

---

### Phase 3: Core Quiz Logic

#### Task 3.1: Question Selection Logic
Create `src/utils/quizLogic.js`:
- Function to shuffle and select N random questions
- Function to combine vocabulary + theory questions
- Function to track current question index and score

#### Task 3.2: Answer Generation Logic
Create `src/utils/answerGenerator.js`:
- **For vocabulary questions**:
  - Randomly select direction (ko→da or da→ko)
  - If `incorrectAnswers[targetLang]` empty → generate 3 random from same category
  - Fallback to same belt rank, then adjacent ranks
- **For theory questions**:
  - Use provided `incorrectAnswers[lang]`
  - If insufficient → generate from other correct answers
- Always shuffle answer positions
- Ensure no duplicates in final options

#### Task 3.3: Quiz State Management
Create `src/hooks/useQuiz.js`:
- Custom hook to manage quiz state (questions, current index, score, answered)
- Handle answer submission and scoring
- Progress to next question

**Deliverable**: Working quiz logic utilities and hooks

---

### Phase 4: UI Components

#### Task 4.1: Quiz Card Component
Create `src/components/QuizCard.jsx`:
- Display question text (language-aware)
- Render 2-4 answer buttons dynamically (Material UI Button)
- Handle button click and visual feedback (correct/incorrect states)
- Show progress indicator (e.g., "Question 5/20")
- Responsive layout for mobile

**UI Requirements**:
- Large touch-friendly buttons (Material UI default = 48px min height)
- Color coding: neutral → green (correct) / red (incorrect)
- Disable buttons after selection

#### Task 4.2: Success Animation
- Integrate `canvas-confetti` library
- Trigger confetti burst on correct answer
- Brief delay (1-2 seconds) before next question

#### Task 4.3: Results Screen
Create `src/components/Results.jsx`:
- Display final score (e.g., "18/20 - 90%")
- Show encouraging message based on performance
- "Try Again" button to restart quiz
- Material UI Card for clean presentation

#### Task 4.4: Main App Component
Update `src/App.jsx`:
- App layout with Material UI ThemeProvider
- Route between Quiz and Results (or simple conditional rendering)
- Start quiz button / configuration (future: select belt rank, question count)

**Deliverable**: Complete, functional quiz interface

---

### Phase 5: PWA Configuration

#### Task 5.1: Web App Manifest
Create `public/manifest.json`:
```json
{
  "name": "Taekwondo Theory Quiz",
  "short_name": "TKD Quiz",
  "description": "Practice Taekwondo theory and terminology",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

#### Task 5.2: Configure Vite PWA Plugin
Update `vite.config.js`:
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        // Use manifest.json
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png}']
      }
    })
  ]
}
```

#### Task 5.3: Generate App Icons
- Create 192x192 and 512x512 PNG icons
- Place in `public/icons/`
- Consider using a Taekwondo-themed icon (e.g., belt, martial arts symbol)

#### Task 5.4: Mobile Optimization
Add meta tags to `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1976d2">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="TKD Quiz">
<link rel="manifest" href="/manifest.json">
<link rel="apple-touch-icon" href="/icons/icon-192x192.png">
```

**Deliverable**: Fully configured PWA ready for installation

---

### Phase 6: Testing & Deployment

#### Task 6.1: Local Testing
- Test all question types display correctly
- Verify bidirectional vocabulary questions work
- Test 2-4 answer options render properly
- Verify confetti animation works
- Test offline mode (disable network in DevTools)

#### Task 6.2: Mobile Device Testing
- **iOS Safari**: Test installation flow, offline mode, touch interactions
- **Android Chrome**: Test installation, responsiveness, performance
- Verify touch targets are accessible (minimum 48x48px)

#### Task 6.3: Build for Production
```bash
npm run build
```
- Verify build completes without errors
- Check bundle size (should be reasonable for mobile)
- Test production build locally (`npm run preview`)

#### Task 6.4: Deploy to Hosting
**Option A: Vercel**
```bash
npm install -g vercel
vercel
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Deployment Checklist**:
- ✅ HTTPS enabled (required for PWA)
- ✅ Service worker registers correctly
- ✅ App installable on mobile devices
- ✅ Offline mode works after first load
- ✅ All assets load correctly

#### Task 6.5: Post-Deployment Validation
- Install app on iOS device and test
- Install app on Android device and test
- Share with stakeholder for feedback

**Deliverable**: Live, working PWA accessible via URL

---

## 🎨 Design Guidelines

### Material UI Theme
- Use default Material UI theme or customize with Taekwondo colors
- Consider: Black (belt), White (dobok), Red/Blue (competition colors)

### Typography
- Question text: Large, bold, easy to read (Typography variant="h5" or h6)
- Answers: Clear, sufficient padding (Button size="large")

### Layout
- Mobile-first design
- Maximum content width for desktop (e.g., 600px centered)
- Ample whitespace between elements

### Accessibility
- Sufficient color contrast (Material UI handles this)
- Touch targets minimum 48x48px
- Screen reader friendly (use semantic HTML)

---

## 📊 Success Metrics (MVP)

- ✅ App loads in < 2 seconds on 3G
- ✅ Installable on iOS and Android
- ✅ Works offline after first load
- ✅ Displays questions with 2-4 options correctly
- ✅ Confetti animation delights users
- ✅ Final score displays accurately
- ✅ Zero crashes during testing

---

## 🚀 Future Enhancements (Post-MVP)

- User accounts and progress tracking
- Leaderboards
- Streak tracking (daily practice)
- Filter questions by belt rank
- Audio pronunciation for Korean terms (when files available)
- Spaced repetition algorithm
- Timed quiz mode
- English translation support
- Dark mode

---

## 📝 Development Notes

- All questions stored in single JSON file (no backend in MVP)
- No analytics in MVP (can add Google Analytics later)
- Focus on core quiz experience first
- Keep it simple and delightful

---

**Last Updated**: 2025-11-06
**Next Steps**: Begin Phase 1 - Project Setup
