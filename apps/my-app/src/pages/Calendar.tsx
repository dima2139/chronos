import React, { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  format,
} from 'date-fns';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Tooltip,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import DaySettingsDialog, { DayType } from '../components/DaySettingDialog'; // import updated dialog + DayType

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  // store settings per day
  const [daySettings, setDaySettings] = useState<
    Record<string, { type: DayType; start: string; end: string; breakMinutes: number }>
  >({});

  // Build a 6x7 matrix of days that fully covers the current month
  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days: Date[] = [];
    for (let d = gridStart; d <= gridEnd; d = addDays(d, 1)) days.push(d);

    // chunk into weeks of 7 days
    const out: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) out.push(days.slice(i, i + 7));
    return out;
  }, [currentMonth]);

  const handleSaveDay = (
    date: Date,
    data: { type: DayType; start: string; end: string; breakMinutes: number }
  ) => {
    setDaySettings((prev) => ({
      ...prev,
      [date.toDateString()]: data,
    }));
    setSelected(null);
  };

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      {/* Month header with navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} aria-label="Previous month">
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h2">
          {format(currentMonth, 'MMMM yyyy')}
        </Typography>
        <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} aria-label="Next month">
          <ArrowForward />
        </IconButton>
      </Box>

      {/* Weekday header */}
      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mb={1}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <Box key={d} textAlign="center">
            <Typography variant="subtitle2" fontWeight="bold">
              {d}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Calendar grid */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gridAutoRows="minmax(90px, auto)"
        gap={1}
      >
        {weeks.map((week, wi) =>
          week.map((day) => {
            const inMonth = isSameMonth(day, currentMonth);
            const isTodayFlag = isToday(day);
            const isSelected = selected && day.toDateString() === selected.toDateString();
            const settings = daySettings[day.toDateString()];

            // Determine display text
            let displayText = '';
            if (settings) {
              switch (settings.type) {
                case 'working':
                  displayText = `${settings.start}–${settings.end}, ${settings.breakMinutes}m`;
                  break;
                case 'sick':
                  displayText = 'Sick Day';
                  break;
                case 'paid':
                  displayText = 'Paid Holiday';
                  break;
                case 'unpaid':
                  displayText = 'Unpaid Holiday';
                  break;
                case 'weekend':
                  displayText = 'Weekend';
                  break;
              }
            }

            return (
              <Tooltip key={`${wi}-${day.toISOString()}`} title={format(day, 'eeee, dd MMM yyyy')} arrow>
                <Paper
                  variant="outlined"
                  onClick={() => setSelected(day)}
                  sx={{
                    height: '100%',
                    p: 1,
                    cursor: 'pointer',
                    borderWidth: isTodayFlag ? 2 : 1,
                    borderColor: isTodayFlag ? 'primary.main' : 'divider',
                    bgcolor: inMonth ? 'background.paper' : 'grey.100',
                    outline: isSelected ? '2px solid' : 'none',
                    outlineColor: isSelected ? 'secondary.main' : 'transparent',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    position: 'relative',
                    '&:hover': { bgcolor: inMonth ? 'grey.50' : 'grey.200' },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      position: 'absolute',
                      top: 6,
                      right: 8,
                      color: inMonth ? 'text.primary' : 'text.disabled',
                      fontWeight: isTodayFlag ? 700 : 500,
                    }}
                  >
                    {format(day, 'd')}
                  </Typography>

                  {/* show custom settings if exist */}
                  <Box mt={4} width="100%">
                    {displayText && (
                      <Typography variant="caption" color="text.secondary">
                        {displayText}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Tooltip>
            );
          })
        )}
      </Box>

      {/* Dialog for selected day */}
      {selected && (
        <DaySettingsDialog
          open={!!selected}
          dayLabel={format(selected, 'eeee, dd MMM yyyy')}
          type={
            daySettings[selected.toDateString()]?.type ??
            (['Saturday', 'Sunday'].includes(format(selected, 'EEEE')) ? 'weekend' : 'working')
          }
          start={daySettings[selected.toDateString()]?.start ?? '09:00'}
          end={daySettings[selected.toDateString()]?.end ?? '17:00'}
          breakMinutes={daySettings[selected.toDateString()]?.breakMinutes ?? 30}
          onClose={() => setSelected(null)}
          onSave={(data:any) => handleSaveDay(selected, data)}
        />
      )}
    </Box>
  );
}
