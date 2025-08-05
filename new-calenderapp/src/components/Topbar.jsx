import React, { useState, useEffect } from 'react'
import { startOfWeek, addDays, format, addWeeks, subWeeks, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval } from 'date-fns'
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
  const [calendarMonth, setCalendarMonth] = useState(currentDate)

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

  const handlePreviousWeek = () => {
    const newDate = subWeeks(currentDate, 1)
    setCurrentDate(newDate)
    setCalendarMonth(newDate)
  }

  const handleNextWeek = () => {
    const newDate = addWeeks(currentDate, 1)
    setCurrentDate(newDate)
    setCalendarMonth(newDate)
  }

  const handlePreviousMonth = () => {
    setCalendarMonth(subWeeks(calendarMonth, 1))
  }

  const handleNextMonth = () => {
    setCalendarMonth(addWeeks(calendarMonth, 1))
  }

  const handleDateSelect = (date) => {
    setCurrentDate(date)
    setShowCalendar(false)
  }

  const isDateInSelectedRange = (date) => {
    return isWithinInterval(date, { start: weekStart, end: weekEnd })
  }

  const isCurrentDay = (date) => {
    return isSameDay(date, new Date())
  }

  const renderCalendar = () => {
    const monthStart = startOfMonth(calendarMonth)
    const monthEnd = endOfMonth(calendarMonth)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
    const endDate = startOfWeek(monthEnd, { weekStartsOn: 6 })
    
    const days = eachDayOfInterval({ start: startDate, end: endDate })

    return (
      <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[280px]">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <button
            onClick={handlePreviousMonth}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium text-gray-900">
            {format(calendarMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={handleNextMonth}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 p-3 border-b border-gray-100">
          {['Su', 'Mo', 'Tu', 'We', 'Thu', 'Fr', 'Sa'].map((day, index) => (
            <div key={index} className="text-xs text-gray-500 text-center font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 p-3">
          {days.map((day, index) => {
            const isSelected = isDateInSelectedRange(day)
            const isToday = isCurrentDay(day)
            const isCurrentMonth = isSameMonth(day, calendarMonth)
            
            return (
              <button
                key={index}
                onClick={() => handleDateSelect(day)}
                className={`
                  w-8 h-8 text-xs rounded-md flex items-center justify-center relative
                  ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${isSelected ? 'text-blue-900' : 'hover:bg-gray-100'}
                  ${isToday ? 'font-semibold' : ''}
                `}
                style={{
                  backgroundColor: isSelected ? '#E1EFFE' : 'transparent'
                }}
              >
                {format(day, 'd')}
                {isToday && (
                  <div className="absolute -bottom-0.5 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center px-4 py-3 border-b border-gray-100 bg-white min-w-0">
      {/* LEFT side: Month/Year title + arrows + calendar */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="text-lg font-semibold text-gray-900">{format(currentDate, 'MMMM yyyy')}</div>

        <button
          onClick={handlePreviousWeek}
          className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-4 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 whitespace-nowrap text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            style={{ borderColor: '#D1D5DB' }}
          >
            {format(weekStart, 'MMM d')} to {format(weekEnd, 'MMM d, yyyy')}
          </button>

          {showCalendar && renderCalendar()}
        </div>

        <button
          onClick={handleNextWeek}
          className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
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
