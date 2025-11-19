import { Box, Button, Container, Link, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Feedback({ onBack }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 3 }}
        >
          Tilbage
        </Button>

        {/* About Section */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Om denne app
          </Typography>
          <Typography variant="body1" paragraph>
            Seung Li Taekwondo Quiz er en app til taekwondo udøvere, som
            ønsker at øve teori og terminologi enten løbende eller op til 
            gradueringer.
          </Typography>
          <Typography variant="body1" paragraph>
            Seung Le er navnet for Roskilde Taekwondo Klub og appen holdes 
            vedlige af Søren Øxenhave. Teori og indhold er i høj grad baseret
            på materialet fra Danmarks Taekwondo Forbund tilpasset klubbens
            egne justeringer fra klubbens sabum-nim'er.
          </Typography>
          <Typography variant="body1" paragraph>
            Appen kan installeres på din telefon, tablet eller computer, 
            hvis du ønsker at den skal fungere offline.
          </Typography>
        </Paper>

        {/* Feedback Section */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Send feedback
          </Typography>
          <Typography variant="body1" paragraph>
            Har du forslag til forbedringer, fundet fejl, eller har du spørgsmål
            til appen?
          </Typography>
          <Typography variant="body1" paragraph>
            Send en email til:{' '}
            <Link href="mailto:soeren@oexenhave.dk" color="primary">
              soeren@oexenhave.dk
            </Link>
          </Typography>
          <Typography variant="body1" paragraph>
            Se kildekoden og bidrag til projektet på{' '}
            <Link href="https://github.com/oexenhave/taekwondo-quiz" color="primary" target="_blank" rel="noopener">
              GitHub
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Feedback;
