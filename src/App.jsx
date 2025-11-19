/**
 * Main App Component
 */

import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Setup from './components/Setup';
import Quiz from './components/Quiz';
import Results from './components/Results';
import BeltRankList from './components/BeltRankList';
import VocabularyBrowser from './components/VocabularyBrowser';
import Feedback from './components/Feedback';
import { useQuiz } from './hooks/useQuiz';
import questionsData from './data/questions.json';

// Create Material UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
  },
});

function App() {
  const quiz = useQuiz(questionsData);
  const [viewState, setViewState] = useState('setup'); // 'setup', 'belt-rank-list', 'vocabulary-browser', 'feedback'
  const [selectedBrowseBelt, setSelectedBrowseBelt] = useState(null);

  const handleBrowseVocabulary = () => {
    setViewState('belt-rank-list');
  };

  const handleFeedback = () => {
    setViewState('feedback');
  };

  const handleSelectBeltRank = (beltRank) => {
    setSelectedBrowseBelt(beltRank);
    setViewState('vocabulary-browser');
  };

  const handleBackToSetup = () => {
    setViewState('setup');
    setSelectedBrowseBelt(null);
  };

  const handleBackToBeltList = () => {
    setViewState('belt-rank-list');
    setSelectedBrowseBelt(null);
  };

  const handleRestartQuiz = () => {
    setViewState('setup');
    setSelectedBrowseBelt(null);
    quiz.restartQuiz();
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Setup Screen */}
      {quiz.quizState === 'setup' && viewState === 'setup' && (
        <Setup
          metadata={questionsData.metadata}
          onStartQuiz={quiz.startQuiz}
          onBrowseVocabulary={handleBrowseVocabulary}
          onFeedback={handleFeedback}
        />
      )}

      {/* Belt Rank Selection for Browsing */}
      {viewState === 'belt-rank-list' && (
        <BeltRankList
          metadata={questionsData.metadata}
          onSelectBeltRank={handleSelectBeltRank}
          onBack={handleBackToSetup}
        />
      )}

      {/* Vocabulary Browser */}
      {viewState === 'vocabulary-browser' && selectedBrowseBelt && (
        <VocabularyBrowser
          beltRank={selectedBrowseBelt}
          vocabularyQuestions={questionsData.vocabularyQuestions}
          theoryQuestions={questionsData.theoryQuestions}
          metadata={questionsData.metadata}
          onBack={handleBackToBeltList}
        />
      )}

      {/* Feedback Screen */}
      {viewState === 'feedback' && (
        <Feedback
          onBack={handleBackToSetup}
        />
      )}

      {/* Quiz Screen */}
      {quiz.quizState === 'quiz' && (
        <Quiz
          getCurrentQuestion={quiz.getCurrentQuestion}
          getProgress={quiz.getProgress}
          answered={quiz.answered}
          selectedAnswer={quiz.selectedAnswer}
          handleAnswerSelect={quiz.handleAnswerSelect}
          handleNext={quiz.handleNext}
          isAnswerCorrect={quiz.isAnswerCorrect}
          onRestart={handleRestartQuiz}
        />
      )}

      {/* Results Screen */}
      {quiz.quizState === 'results' && (
        <Results
          results={quiz.getResults()}
          metadata={questionsData.metadata}
          onRestart={handleRestartQuiz}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
