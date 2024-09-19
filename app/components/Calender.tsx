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
        sx={{
          color: isSelected ? '#fff' : 'red', // White text for selected, red for non-selected
          backgroundColor: isSelected ? 'red' : 'transparent', // Red background for selected day
          '&.Mui-selected': {
            backgroundColor: 'red', // Red selection circle
            color: '#fff', // White text for selected dates
            '&:hover': {
              backgroundColor: 'darkred', // Darker red on hover
            },
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ width: 320, height: "auto"}}>
      <DateCalendar
        onChange={handleDateChange}
        slots={{ day: CustomDay }}
        sx={{
          '& .MuiPickersDay-root': {
            color: 'red', // Unselected day numbers text color
          },
          '& .MuiDayCalendar-weekDayLabel': {
            color: 'red', // Day labels (Mon, Tue, etc.) text color
          },
        }}
      />
    </Box>
  );
};

export default MultiDateCalendar;
