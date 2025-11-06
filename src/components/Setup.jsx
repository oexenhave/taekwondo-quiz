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
  Alert
} from '@mui/material';
import { getBeltRankOptions } from '../utils/quizLogic';

const QUESTION_COUNTS = [10, 25, 50, 100];

export default function Setup({ metadata, onStartQuiz, warning }) {
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
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Taekwondo Teori Quiz
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph align="center">
            Vælg dit niveau og antal spørgsmål
          </Typography>

          {warning && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {warning}
            </Alert>
          )}

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
              fontSize: '1.1rem'
            }}
          >
            Start test
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
