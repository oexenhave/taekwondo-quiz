/**
 * VocabularyBrowser Component - Display vocabulary by category in tables
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CATEGORY_ORDER = [
  'stances',
  'hand_techniques',
  'leg_techniques',
  'theory_terms',
  'miscellaneous'
];

export default function VocabularyBrowser({
  beltRank,
  vocabularyQuestions,
  theoryQuestions,
  metadata,
  onBack
}) {
  // Filter questions for selected belt rank
  const beltQuestions = vocabularyQuestions.filter(
    q => q.beltRank === beltRank
  );

  // Filter theory questions for selected belt rank
  const beltTheoryQuestions = theoryQuestions.filter(
    q => q.beltRank === beltRank
  );

  // Group questions by category
  const questionsByCategory = {};
  beltQuestions.forEach(question => {
    if (!questionsByCategory[question.category]) {
      questionsByCategory[question.category] = [];
    }
    questionsByCategory[question.category].push(question);
  });

  const beltLabel = metadata.beltRanks[beltRank]?.da || beltRank;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        width: '100%',
        bgcolor: 'background.default',
        p: 2
      }}
    >
      <Card sx={{ width: { xs: '100%', md: 900 }, maxWidth: '100%' }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 2 }}
          >
            Tilbage
          </Button>

          <Typography variant="h4" component="h1" gutterBottom align="center">
            {beltLabel}
          </Typography>

          {/* Display categories in order */}
          {CATEGORY_ORDER.map(categoryId => {
            const questions = questionsByCategory[categoryId];
            if (!questions || questions.length === 0) return null;

            const categoryLabel = metadata.categories[categoryId]?.da || categoryId;

            return (
              <Box key={categoryId} sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  {categoryLabel}
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>
                          Koreansk
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '50%' }}>
                          Dansk
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {questions.map(question => (
                        <TableRow key={question.id}>
                          <TableCell>{question.translations.ko}</TableCell>
                          <TableCell>{question.translations.da}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            );
          })}

          {/* Theory Questions Section */}
          {beltTheoryQuestions.length > 0 && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                Teori spørgsmål
              </Typography>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', width: '60%' }}>
                        Spørgsmål
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>
                        Korrekt svar
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {beltTheoryQuestions.map(question => (
                      <TableRow key={question.id}>
                        <TableCell>{question.question.da}</TableCell>
                        <TableCell>{question.correctAnswer.da}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Show message if no vocabulary for this belt */}
          {beltQuestions.length === 0 && beltTheoryQuestions.length === 0 && (
            <Typography variant="body1" color="text.secondary" align="center">
              Ingen ordforråd eller teori spørgsmål tilgængeligt for denne bæltegrad.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
