/**
 * Setup Component - Belt level and question count selection
 */

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  ButtonGroup,
  Link
} from '@mui/material';
import { getBeltRankOptions } from '../utils/quizLogic';

const QUESTION_COUNTS = [10, 25, 50, 100];

export default function Setup({ metadata, onStartQuiz, onBrowseVocabulary, onFeedback }) {
  const [selectedBeltRank, setSelectedBeltRank] = useState('');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);

  const beltRankOptions = getBeltRankOptions(metadata);

  const handleStart = () => {
    if (selectedBeltRank && selectedQuestionCount) {
      onStartQuiz(selectedBeltRank, selectedQuestionCount);
    }
  };

  const canStart = selectedBeltRank && selectedQuestionCount;

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
        <CardContent sx={{ p: 4 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img
              src={`${import.meta.env.BASE_URL}rtk-logo.jpg`}
              alt="Roskilde Taekwondo Logo"
              style={{
                maxWidth: '200px',
                width: '100%',
                height: 'auto'
              }}
            />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Taekwondo Teori Quiz
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph align="center">
            Vælg dit niveau og antal spørgsmål
          </Typography>

          {/* Belt Rank Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="belt-rank-label">Test til</InputLabel>
            <Select
              labelId="belt-rank-label"
              id="belt-rank-select"
              value={selectedBeltRank}
              label="Test til"
              onChange={(e) => setSelectedBeltRank(e.target.value)}
            >
              {beltRankOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Question Count Selection */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              Antal spørgsmål
            </Typography>
            <ButtonGroup
              fullWidth
              variant="outlined"
              aria-label="question count selection"
            >
              {QUESTION_COUNTS.map(count => (
                <Button
                  key={count}
                  variant={selectedQuestionCount === count ? 'contained' : 'outlined'}
                  onClick={() => setSelectedQuestionCount(count)}
                  sx={{
                    py: 1.5,
                    fontSize: '1rem'
                  }}
                >
                  {count}
                </Button>
              ))}
            </ButtonGroup>
          </Box>

          {/* Start Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleStart}
            disabled={!canStart}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              mb: 2
            }}
          >
            Start test
          </Button>

          {/* Browse Vocabulary Button */}
          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={onBrowseVocabulary}
            sx={{
              py: 1.5,
              fontSize: '1.1rem'
            }}
          >
            Gennemse teorien
          </Button>

          {/* Version Info and Feedback Link */}
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography
              variant="caption"
              color="text.secondary"
              component="span"
            >
              v{__APP_VERSION__} • Built: {__BUILD_DATE__}
            </Typography>
            <Typography
              variant="caption"
              component="span"
              sx={{ mx: 1 }}
              color="text.secondary"
            >
              •
            </Typography>
            <Link
              component="button"
              variant="caption"
              onClick={onFeedback}
              sx={{ cursor: 'pointer' }}
            >
              Feedback
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
