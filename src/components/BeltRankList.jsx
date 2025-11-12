/**
 * BeltRankList Component - Display belt ranks for vocabulary browsing
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BELT_RANKS = [
  '10_kup', '9_kup', '8_kup', '7_kup', '6_kup',
  '5_kup', '4_kup', '3_kup', '2_kup', '1_kup',
  '1_dan', '2_dan', '3_dan'
];

export default function BeltRankList({ metadata, onSelectBeltRank, onBack }) {
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
          {/* Back Button */}
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 2 }}
          >
            Tilbage
          </Button>

          <Typography variant="h4" component="h1" gutterBottom align="center">
            Vælg bæltegrad
          </Typography>

          {/* Belt Rank List */}
          <List>
            {BELT_RANKS.map((beltRankId) => {
              const beltLabel = metadata.beltRanks[beltRankId]?.da || beltRankId;
              return (
                <ListItem key={beltRankId} disablePadding>
                  <ListItemButton
                    onClick={() => onSelectBeltRank(beltRankId)}
                    sx={{
                      py: 2,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  >
                    <ListItemText
                      primary={beltLabel}
                      primaryTypographyProps={{
                        variant: 'h6',
                        align: 'center'
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
}
