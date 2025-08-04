import React, { useState, useEffect } from 'react'
import { startOfWeek, addDays, format } from 'date-fns'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import TimezoneBar from './TimezoneBar'

const Topbar = ({
  currentDate,
  setCurrentDate,
  goToPreviousWeek,
  goToNextWeek,
  timezone,
  setTimezone
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const weekEnd = addDays(weekStart, 6)
  const [showCalendar, setShowCalendar] = useState(false)

  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
    updateClock()
    const interval = setInterval(updateClock, 60000)
    return () => clearInterval(interval)
  }, [timezone])

  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-white min-w-0">
      {/* LEFT side: Date title + arrows + calendar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-lg font-semibold whitespace-nowrap">{format(currentDate, 'MMMM yyyy')}</div>

        <button
          onClick={goToPreviousWeek}
          className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 text-base flex items-center justify-center flex-shrink-0"
        >
          &#8249;
        </button>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-100 whitespace-nowrap"
          >
            {format(weekStart, 'MMM d')} to {format(weekEnd, 'MMM d, yyyy')}
          </button>

          {showCalendar && (
            <div className="absolute left-0 top-full mt-1 z-50">
              <DatePicker
                selected={currentDate}
                onChange={(date) => {
                  setCurrentDate(date)
                  setShowCalendar(false)
                }}
                inline
              />
            </div>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 text-base flex items-center justify-center flex-shrink-0"
        >
          &#8250;
        </button>
      </div>

      {/* RIGHT side: Timezone selector */}
      <div className="ml-auto flex items-center gap-2 flex-shrink-0">
        <TimezoneBar timezone={timezone} setTimezone={setTimezone} />
      </div>
    </div>
  )
}

export default Topbar
