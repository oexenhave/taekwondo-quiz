/**
 * QuizCard Component - Display single question with answers
 */

import { Box, Card, CardContent, Typography, Button, Chip, IconButton } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import confetti from 'canvas-confetti';

export default function QuizCard({
  question,
  progress,
  answered,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  isAnswerCorrect,
  onRestart
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

  const getButtonStyles = (answer) => {
    if (!answered) {
      return {};
    }

    // Show correct answer in green
    if (isAnswerCorrect(answer)) {
      return {
        backgroundColor: '#4caf50',
        color: 'white',
        borderColor: '#4caf50',
        '&:hover': {
          backgroundColor: '#45a049'
        }
      };
    }

    // Show selected wrong answer in red
    if (answer === selectedAnswer && !isAnswerCorrect(answer)) {
      return {
        backgroundColor: '#f44336',
        color: 'white',
        borderColor: '#f44336',
        '&:hover': {
          backgroundColor: '#da190b'
        }
      };
    }

    // Other answers: keep neutral/muted
    return {
      backgroundColor: 'transparent',
      color: 'rgba(0, 0, 0, 0.38)',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      pointerEvents: 'none'
    };
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ width: { xs: '100%', sm: 600 } }}>
        <CardContent sx={{ p: 3 }}>
          {/* Progress Indicator and Restart Button */}
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={`Spørgsmål ${progress.current}/${progress.total}`}
              color="primary"
              variant="outlined"
            />
            <IconButton
              onClick={onRestart}
              color="primary"
              aria-label="start over"
              title="Start forfra"
            >
              <HomeIcon />
            </IconButton>
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
                variant={answered ? 'contained' : 'outlined'}
                fullWidth
                size="large"
                onClick={() => handleAnswerClick(answer)}
                sx={{
                  mb: 2,
                  py: 2,
                  fontSize: '1rem',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  cursor: answered ? 'default' : 'pointer',
                  ...getButtonStyles(answer)
                }}
              >
                {answer}
              </Button>
            ))}
          </Box>

          {/* Next Button - always reserve space to prevent layout jump */}
          <Box sx={{ minHeight: '56px' }}>
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
