import { useState } from 'react'
import CalendarLayout from './components/CalenderLayout'

// Simple list of all members
const allMembers = [
  "zack.bing@gmail.com",
  "jane.doe@gmail.com",
  "system@calendar.io",
];

function App() {
  // Simple state variables
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMembers, setSelectedMembers] = useState(allMembers);
  const [timezone, setTimezone] = useState('Asia/Karachi')

  // Simple functions to go to previous and next week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  }

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  }

  return (
    <div className="flex h-screen">
      <CalendarLayout
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
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
