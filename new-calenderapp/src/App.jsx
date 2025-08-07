import React ,{ useState } from 'react'
import CalendarLayout from './components/CalenderLayout'

// Simple list of all members till now manually but in future will be doing it with api fetch
const allMembers = [
  "zack.bing@gmail.com",
  "jane.doe@gmail.com",
  "arc@iclosed.io",

];

function App() {
  // Simple state variables
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [selectedMembers, setSelectedMembers] = useState(allMembers);
  const [timezone, setTimezone] = useState('Asia/Karachi')

  // Simple functions to go to previous and next week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
    setCalendarMonth(newDate); 
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
    setCalendarMonth(newDate); 
  }

  return (
    <div className="flex h-screen">
      <CalendarLayout
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        calendarMonth={calendarMonth}
        setCalendarMonth={setCalendarMonth}
        goToPreviousWeek={goToPreviousWeek}
        goToNextWeek={goToNextWeek}
        timezone={timezone}
        setTimezone={setTimezone}
        selectedMembers={selectedMembers}
        setSelectedMembers={setSelectedMembers}
      />
    </div>
  )
}

export default App
