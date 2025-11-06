/**
 * Results Component - Display quiz results and score
 */

import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

export default function Results({ results, onRestart }) {
  const { score, total, percentage, message } = results;

  const getScoreColor = () => {
    if (percentage >= 90) return 'success.main';
    if (percentage >= 70) return 'info.main';
    if (percentage >= 50) return 'warning.main';
    return 'error.main';
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
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Resultat
          </Typography>

          {/* Trophy Icon */}
          <Box sx={{ my: 3 }}>
            <TrophyIcon sx={{ fontSize: 80, color: getScoreColor() }} />
          </Box>

          {/* Score Display */}
          <Typography
            variant="h2"
            component="div"
            sx={{ color: getScoreColor(), fontWeight: 'bold', mb: 1 }}
          >
            {score} / {total}
          </Typography>

          <Typography variant="h4" color="text.secondary" gutterBottom>
            {percentage}%
          </Typography>

          {/* Encouraging Message */}
          <Typography
            variant="h6"
            color="text.primary"
            sx={{ my: 4, px: 2 }}
          >
            {message}
          </Typography>

          {/* Restart Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={onRestart}
            sx={{
              py: 1.5,
              fontSize: '1.1rem',
              mt: 2
            }}
          >
            Prøv igen
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
