import { useState } from 'react'
import CalendarLayout from './components/CalenderLayout'
import { addDays } from 'date-fns'
const allMembers = [
  "zack.bing@gmail.com",
  "jane.doe@gmail.com",
  "system@calendar.io",
];

function App() {
  // Use the actual current date so current day highlighting works dynamically
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedMembers, setSelectedMembers] = useState(allMembers);
  const [timezone, setTimezone] = useState('Asia/Karachi')

  const goToPreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7))
  }

  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7))
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
