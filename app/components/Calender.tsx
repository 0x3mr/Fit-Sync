import React, { useState } from "react";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Box } from '@mui/material';

const MultiDateCalendar = () => {
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const alreadySelected = selectedDates.some((selectedDate) =>
        selectedDate.isSame(date, "day")
      );
      if (alreadySelected) {
        setSelectedDates(
          selectedDates.filter((selectedDate) => !selectedDate.isSame(date, "day"))
        );
      } else {
        setSelectedDates([...selectedDates, date]);
      }
    }
  };

  const CustomDay = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(day, "day")
    );

    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={isSelected}
      />
    );
  };

  return (
    <Box sx={{ width: 320, height: 400 }}>
      <DateCalendar
        onChange={handleDateChange}
        slots={{ day: CustomDay }}
      />
    </Box>
  );
};

export default MultiDateCalendar;
