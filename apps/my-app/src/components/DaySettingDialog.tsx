import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import { differenceInMinutes, parse } from 'date-fns';

export type DayType = 'working' | 'sick' | 'paid' | 'unpaid' | 'weekend';

interface DaySettingsDialogProps {
  open: boolean;
  dayLabel: string;
  type: DayType;
  start?: string;
  end?: string;
  breakMinutes?: number;
  onClose: () => void;
  onSave: (data: {
    type: DayType;
    start: string;
    end: string;
    breakMinutes: number;
  }) => void;
}

export default function DaySettingsDialog({
  open,
  dayLabel,
  type,
  start = '09:00',
  end = '17:00',
  breakMinutes = 30,
  onClose,
  onSave,
}: DaySettingsDialogProps) {
  const [localType, setLocalType] = React.useState<DayType>(type);
  const [localStart, setLocalStart] = React.useState(start);
  const [localEnd, setLocalEnd] = React.useState(end);
  const [localBreak, setLocalBreak] = React.useState(breakMinutes);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLocalType(type);
    setLocalStart(start);
    setLocalEnd(end);
    setLocalBreak(breakMinutes);
    setError(null);
  }, [type, start, end, breakMinutes]);

  const validateAndSave = () => {
    if (localType !== 'working') {
      onSave({ type: localType, start: '', end: '', breakMinutes: 0 });
      return;
    }

    const startDate = parse(localStart, 'HH:mm', new Date());
    const endDate = parse(localEnd, 'HH:mm', new Date());
    const duration = differenceInMinutes(endDate, startDate);

    if (duration <= 0) {
      setError('End time must be after start time.');
      return;
    }

    let minBreak = 0;
    if (duration >= 360 && duration <= 480) minBreak = 30;
    if (duration > 480) minBreak = 45;

    if (localBreak < minBreak) {
      setError(`Break must be at least ${minBreak} minutes for this shift length.`);
      return;
    }

    setError(null);
    onSave({
      type: localType,
      start: localStart,
      end: localEnd,
      breakMinutes: localBreak,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{dayLabel} Settings</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <FormControl fullWidth>
            <InputLabel id="day-type-label">Day Type</InputLabel>
            <Select
              labelId="day-type-label"
              value={localType}
              label="Day Type"
              onChange={(e) => setLocalType(e.target.value as DayType)}
            >
              <MenuItem value="working">Working Day</MenuItem>
              <MenuItem value="sick">Sick Day</MenuItem>
              <MenuItem value="paid">Paid Holiday</MenuItem>
              <MenuItem value="unpaid">Unpaid Holiday</MenuItem>
              <MenuItem value="weekend">Weekend</MenuItem>
            </Select>
          </FormControl>

          {localType === 'working' && (
            <>
              <TextField
                label="Start Time"
                type="time"
                value={localStart}
                onChange={(e) => setLocalStart(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <TextField
                label="End Time"
                type="time"
                value={localEnd}
                onChange={(e) => setLocalEnd(e.target.value)}
                InputLabelProps={{ shrink: true }}
                inputProps={{ step: 300 }}
              />
              <TextField
                label="Break (minutes)"
                type="number"
                value={localBreak}
                onChange={(e) => setLocalBreak(Number(e.target.value))}
                inputProps={{ min: 0, max: 120 }}
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={validateAndSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
