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
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getBeltRankOptions } from '../utils/quizLogic';

const QUESTION_COUNTS = [10, 25, 50, 100];

export default function Setup({ metadata, onStartQuiz, onBrowseVocabulary, onFeedback }) {
  const [selectedBeltRank, setSelectedBeltRank] = useState('');
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);

  // Get all category keys and initialize all as selected
  const categoryKeys = Object.keys(metadata.categories);
  const [selectedCategories, setSelectedCategories] = useState(
    categoryKeys.reduce((acc, key) => ({ ...acc, [key]: true }), {})
  );

  const beltRankOptions = getBeltRankOptions(metadata);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleStart = () => {
    if (selectedBeltRank && selectedQuestionCount) {
      const enabledCategories = categoryKeys.filter(key => selectedCategories[key]);
      onStartQuiz(selectedBeltRank, selectedQuestionCount, enabledCategories);
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
            Seung Li Taekwondo Quiz
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
          <Box sx={{ mb: 3 }}>
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

          {/* Category Filter (Collapsible) */}
          <Accordion sx={{ mb: 4 }} elevation={0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="category-filter-content"
              id="category-filter-header"
            >
              <Typography variant="body2">Tilpas kategorier til quizzen</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormGroup>
                {categoryKeys.map(categoryKey => (
                  <FormControlLabel
                    key={categoryKey}
                    control={
                      <Checkbox
                        checked={selectedCategories[categoryKey]}
                        onChange={() => handleCategoryToggle(categoryKey)}
                      />
                    }
                    label={metadata.categories[categoryKey].da}
                  />
                ))}
              </FormGroup>
            </AccordionDetails>
          </Accordion>

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
