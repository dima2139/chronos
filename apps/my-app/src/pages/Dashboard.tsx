import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Stack,
} from '@mui/material';

export default function Dashboard() {
  // Fake data placeholders — replace with API calls later
  const workedHours = 72;
  const contractedHours = 80;
  const vacationLeft = 12;
  const sickDays = 3;
  const nextHoliday = '03 Oct 2025 (German Unity Day)';
  const nextVacation = '12 Oct 2025 – 16 Oct 2025';

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2}>
        {/* Hours worked vs contracted */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Hours This Month</Typography>
            <Typography variant="body1">
              {workedHours} / {contractedHours} hrs
            </Typography>
          </Paper>
        </Grid>

        {/* Vacation days left */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Vacation Left</Typography>
            <Typography variant="body1">{vacationLeft} days</Typography>
          </Paper>
        </Grid>

        {/* Sick days */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Sick Days</Typography>
            <Typography variant="body1">{sickDays}</Typography>
          </Paper>
        </Grid>

        {/* Upcoming events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Upcoming</Typography>
            <Typography variant="body2">Next Holiday: {nextHoliday}</Typography>
            <Typography variant="body2">Next Vacation: {nextVacation}</Typography>
          </Paper>
        </Grid>

        {/* Quick links */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Quick Links</Typography>
            <Stack direction="row" spacing={2} mt={1}>
              <Button variant="contained" color="primary">
                Submit Timesheet
              </Button>
              <Button variant="outlined" color="secondary">
                Request Leave
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
