/**
 * Main App Component
 */

import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Setup from './components/Setup';
import Quiz from './components/Quiz';
import Results from './components/Results';
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {quiz.quizState === 'setup' && (
        <Setup
          metadata={questionsData.metadata}
          onStartQuiz={quiz.startQuiz}
        />
      )}

      {quiz.quizState === 'quiz' && (
        <Quiz
          getCurrentQuestion={quiz.getCurrentQuestion}
          getProgress={quiz.getProgress}
          answered={quiz.answered}
          selectedAnswer={quiz.selectedAnswer}
          handleAnswerSelect={quiz.handleAnswerSelect}
          handleNext={quiz.handleNext}
          isAnswerCorrect={quiz.isAnswerCorrect}
          onRestart={quiz.restartQuiz}
        />
      )}

      {quiz.quizState === 'results' && (
        <Results
          results={quiz.getResults()}
          metadata={questionsData.metadata}
          onRestart={quiz.restartQuiz}
        />
      )}
    </ThemeProvider>
  );
}

export default App;
