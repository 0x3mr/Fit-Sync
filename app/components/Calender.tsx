import React, { useState } from "react";
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import { Box } from '@mui/material';
import dayjs from 'dayjs';

export interface HighlightedDay {
  date: string; // ISO date string
  type: string; // 'training', 'rest', 'weekend', etc.
}

interface MultiDateCalendarProps {
  highlightedDays?: HighlightedDay[]; // Optional, default to an empty array
}

const MultiDateCalendar: React.FC<MultiDateCalendarProps> = ({ highlightedDays = [] }) => {
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  // console.log("CALLLEEE", highlightedDays);

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

  // Safely create a map for faster lookup, ensure highlightedDays is an array
  const highlightMap = new Map(
    highlightedDays.map((day) => {
      const dateObject = new Date(day.date);
      // Set the time to the start of the day (midnight)
      dateObject.setUTCHours(0, 0, 0, 0); // Set time to UTC midnight
      const dateKey = dateObject.toDateString(); // Format it as 'Mon Sep 23 2024'
      // console.log(`Adding to map: ${dateKey} => REALLL ${day.date}`); // Log what you're adding
      return [dateKey, day.type];
    })
  );


  const CustomDay = (props: any) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const isSelected = selectedDates.some((selectedDate) =>
      selectedDate.isSame(day, "day")
    );
  
    // Check if this day is today
    const isToday = day.isSame(dayjs(), 'day');
  
    // Find if this day is highlighted using the map
    const highlightType = highlightMap.get(day.toDate().toDateString());
    // console.log(highlightType, day.toDate().toDateString());
  
    return (
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        selected={isSelected}
        sx={{
          color: isSelected ? '#fff' : 'black',
          backgroundColor: isSelected ? 'red' : 'transparent',
          // Apply specific background color for highlighted day types
          ...(highlightType === 'training' && {
            backgroundColor: isToday ? '#ff9f9f82' : '#ff5a5a96', // Override today’s style
            // border: 2px solid #00f8ff;

          }),
          // Add specific styles for today's date
          ...(isToday && {
            border: `2px solid #00f8ff`, // The blue circle indicating today
          }),
          '&.Mui-selected': {
            backgroundColor: 'red',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'darkred',
            },
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ width: 320, height: "auto" }}>
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
          '& .MuiPickersDay-root:not(.Mui-selected)': {
            border: `2px solid #00f8ff` // fuxed up

          },
        }}
      />
    </Box>
  );
};

export default MultiDateCalendar;


