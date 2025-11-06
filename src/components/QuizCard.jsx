/**
 * QuizCard Component - Display single question with answers
 */

import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import confetti from 'canvas-confetti';

export default function QuizCard({
  question,
  progress,
  answered,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  isAnswerCorrect
}) {
  const handleAnswerClick = (answer) => {
    if (!answered) {
      onAnswerSelect(answer);

      // Trigger confetti if correct
      if (isAnswerCorrect(answer)) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const getButtonColor = (answer) => {
    if (!answered) return 'primary';

    // Show correct answer in green
    if (isAnswerCorrect(answer)) {
      return 'success';
    }

    // Show selected wrong answer in red
    if (answer === selectedAnswer && !isAnswerCorrect(answer)) {
      return 'error';
    }

    return 'primary';
  };

  const getButtonVariant = (answer) => {
    if (!answered) return 'outlined';

    // Highlight correct and selected answers
    if (isAnswerCorrect(answer) || answer === selectedAnswer) {
      return 'contained';
    }

    return 'outlined';
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          {/* Progress Indicator */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Spørgsmål ${progress.current}/${progress.total}`}
              color="primary"
              variant="outlined"
            />
          </Box>

          {/* Question Text */}
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            sx={{ mb: 4, minHeight: '3em' }}
          >
            {question.questionText}
          </Typography>

          {/* Answer Buttons */}
          <Box sx={{ mb: 3 }}>
            {question.answers.map((answer, index) => (
              <Button
                key={index}
                variant={getButtonVariant(answer)}
                color={getButtonColor(answer)}
                fullWidth
                size="large"
                onClick={() => handleAnswerClick(answer)}
                disabled={answered}
                sx={{
                  mb: 2,
                  py: 2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  textAlign: 'left'
                }}
              >
                {answer}
              </Button>
            ))}
          </Box>

          {/* Next Button */}
          {answered && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={onNext}
              sx={{
                py: 1.5,
                fontSize: '1.1rem'
              }}
            >
              Næste
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
