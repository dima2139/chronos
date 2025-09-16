import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
} from '@mui/material';
import DaySettingsDialog, { DayType } from '../components/DaySettingDialog'; // import updated dialog + DayType

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Profile() {
  const [settings, setSettings] = useState<
    Record<string, { type: DayType; start: string; end: string; breakMinutes: number }>
  >({
    Monday: { type: 'working', start: '09:00', end: '17:00', breakMinutes: 30 },
    Tuesday: { type: 'working', start: '09:00', end: '17:00', breakMinutes: 30 },
    Wednesday: { type: 'working', start: '09:00', end: '17:00', breakMinutes: 30 },
    Thursday: { type: 'working', start: '09:00', end: '17:00', breakMinutes: 30 },
    Friday: { type: 'working', start: '09:00', end: '15:00', breakMinutes: 30 },
    Saturday: { type: 'weekend', start: '', end: '', breakMinutes: 0 },
    Sunday: { type: 'weekend', start: '', end: '', breakMinutes: 0 },
  });

  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const handleSaveDay = (
    day: string,
    data: { type: DayType; start: string; end: string; breakMinutes: number }
  ) => {
    setSettings((prev) => ({ ...prev, [day]: data }));
    setSelectedDay(null);
  };

  const handleSaveAll = () => {
    alert(`Saved weekly pattern:\n${JSON.stringify(settings, null, 2)}`);
  };

  const getSummary = (s: { type: DayType; start: string; end: string; breakMinutes: number }) => {
    switch (s.type) {
      case 'working':
        return `${s.start}–${s.end}, ${s.breakMinutes}m break`;
      case 'sick':
        return 'Sick Day';
      case 'paid':
        return 'Paid Holiday';
      case 'unpaid':
        return 'Unpaid Holiday';
      case 'weekend':
        return 'Weekend';
      default:
        return 'Off';
    }
  };

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Usual Weekly Working Hours
        </Typography>

        <Grid container spacing={2}>
          {weekdays.map((day) => {
            const s = settings[day];
            return (
              <Grid item xs={6} sm={4} key={day}>
                <Paper
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: s.type === 'working' ? 'primary.light' : 'grey.200',
                    '&:hover': { bgcolor: 'primary.main', color: 'white' },
                  }}
                  onClick={() => setSelectedDay(day)}
                >
                  <Typography variant="subtitle1">{day}</Typography>
                  <Typography variant="body2">{getSummary(s)}</Typography>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        <Box mt={3} textAlign="right">
          <Button variant="contained" onClick={handleSaveAll}>
            Save All
          </Button>
        </Box>
      </Paper>

      {/* Dialog */}
      {selectedDay && (
        <DaySettingsDialog
          open={!!selectedDay}
          dayLabel={selectedDay}
          type={settings[selectedDay].type}
          start={settings[selectedDay].start}
          end={settings[selectedDay].end}
          breakMinutes={settings[selectedDay].breakMinutes}
          onClose={() => setSelectedDay(null)}
          onSave={(data:any) => handleSaveDay(selectedDay, data)}
        />
      )}
    </Box>
  );
}
