import React, { useState } from 'react'
import TimezoneBar from './TimezoneBar'
import { 
  getWeekStart, 
  addDays, 
  formatDate, 
  formatShortDate, 
  isCurrentDay, 
  isSameMonth, 
  getDaysInMonth 
} from '../utils/dateUtils'

const Topbar = ({
  currentDate,
  setCurrentDate,
  calendarMonth,
  setCalendarMonth,
  goToPreviousWeek,
  goToNextWeek,
  timezone,
  setTimezone
}) => {
  // Simple state variables
  const [showCalendar, setShowCalendar] = useState(false)

  // Calculate week start and end using shared utilities

  // Get year for date range display
  const getDateRangeYear = () => {
    const year = weekEnd.getFullYear();
    return year;
  };

  // Calculate week start and end
  const weekStart = getWeekStart(currentDate);
  const weekEnd = addDays(weekStart, 6);

  // Navigation functions now use props from App.jsx (no duplicates needed)

  // Simple function to handle previous month
  const handlePreviousMonth = () => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    setCalendarMonth(newDate);
  }

  // Simple function to handle next month
  const handleNextMonth = () => {
    const newDate = new Date(calendarMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCalendarMonth(newDate);
  }

  // Simple function to handle date selection
  const handleDateSelect = (date) => {
    setCurrentDate(date);
    setShowCalendar(false);
  }

  // Simple function to check if date is in selected range
  const isDateInSelectedRange = (date) => {
    return date >= weekStart && date <= weekEnd;
  }

  // Helper functions now imported from shared utilities

  // Simple function to render calendar
  const renderCalendar = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const firstDayOfWeek = firstDay.getDay();
    
    // Get last day of month
    const lastDay = new Date(year, month, getDaysInMonth(year, month));
    const lastDayOfWeek = lastDay.getDay();
    
    // Calculate start and end dates for calendar grid
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDayOfWeek);
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDayOfWeek));
    
    // Create array of all days to display
    const days = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

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
          <span className="text-sm font-semibold text-gray-900">
            {formatDate(calendarMonth)}
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
            const isSelected = isDateInSelectedRange(day);
            const isToday = isCurrentDay(day);
            const isCurrentMonth = isSameMonth(day, calendarMonth);
            
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
                {day.getDate()}
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
        <div className="text-lg font-semibold text-gray-900">{formatDate(currentDate)}</div>

        <button
          onClick={goToPreviousWeek}
          className="w-8 h-8 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="px-6 py-2 border rounded-md text-sm bg-white hover:bg-gray-50 whitespace-nowrap text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px] font-medium"
            style={{ borderColor: '#D1D5DB' }}
          >
            <span className="text-gray-900 font-semibold">{formatShortDate(weekStart)}</span>
            <span className="text-gray-500 mx-1 font-medium">to</span>
            <span className="text-gray-900 font-semibold">{formatShortDate(weekEnd)}</span>
            <span className="text-gray-900 ml-1 font-semibold">, {getDateRangeYear()}</span>
          </button>

          {showCalendar && renderCalendar()}
        </div>

        <button
          onClick={goToNextWeek}
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
