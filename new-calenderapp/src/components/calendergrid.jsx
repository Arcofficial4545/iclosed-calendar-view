import React, { useState, useRef, useEffect } from 'react';
import EventDetailPopup from './EventDetailPopup';

const CalendarGrid = ({ currentDate = new Date(), timezone = 'UTC' }) => {
  // Simple state variables
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isEventDragging, setIsEventDragging] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [dragEndPosition, setDragEndPosition] = useState(null);
  const [popupEvent, setPopupEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [events, setEvents] = useState([]);

  // Simple refs
  const scrollRef = useRef(null);
  const timeColumnRef = useRef(null);

  // Update current time every 30 seconds
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      setCurrentTime(timeInTimezone);
    };

    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, [timezone]);

  // Simple helper functions
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const result = new Date(date);
    result.setDate(result.getDate() - day);
    return result;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDay = (date) => {
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayIndex = date.getDay();
    const dayNumber = date.getDate();
    const formattedDayNumber = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    return {
      name: dayNames[dayIndex],
      number: formattedDayNumber
    };
  };

  const formatTime = (hour) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      hour12: true
    });
  };

  const getEventHourInTimezone = (eventHour) => {
    const usaCanadaTimezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg'];
    const southAmericaTimezones = ['America/Sao_Paulo', 'America/Argentina/Buenos_Aires', 'America/Santiago', 'America/Lima', 'America/Bogota', 'America/Caracas'];
    
    if ([...usaCanadaTimezones, ...southAmericaTimezones].includes(timezone)) {
      let localHour;
      
      if (timezone.includes('America/New_York') || timezone.includes('America/Toronto')) {
        localHour = eventHour - 5;
      } else if (timezone.includes('America/Chicago') || timezone.includes('America/Winnipeg')) {
        localHour = eventHour - 6;
      } else if (timezone.includes('America/Denver') || timezone.includes('America/Edmonton')) {
        localHour = eventHour - 7;
      } else if (timezone.includes('America/Los_Angeles') || timezone.includes('America/Vancouver')) {
        localHour = eventHour - 8;
      } else {
        localHour = eventHour - 3;
      }
      
      localHour = (localHour + 24) % 24;
      
      if (localHour === 13) {
        localHour = 14;
      }
      
      if (localHour < 8) localHour = 8;
      if (localHour > 18) localHour = 18;
      
      return localHour;
    } else {
      const eventDate = new Date();
      eventDate.setHours(eventHour, 0, 0, 0);
      
      const timeInTimezone = new Date(eventDate.toLocaleString('en-US', { timeZone: timezone }));
      let adjustedHour = timeInTimezone.getHours();
      
      const eventDay = eventDate.getDate();
      const timezoneDay = timeInTimezone.getDate();
      if (eventDay !== timezoneDay) {
        if (timezoneDay > eventDay) {
          adjustedHour = adjustedHour;
        } else {
          adjustedHour = adjustedHour;
        }
      }
      
      adjustedHour = (adjustedHour + 24) % 24;
      
      if (adjustedHour === 13) {
        adjustedHour = 14;
      }
      
      if (adjustedHour < 9) adjustedHour = 9;
      if (adjustedHour > 16) adjustedHour = 16;
      
      return adjustedHour;
    }
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const timeInTimezone = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    const currentHour = timeInTimezone.getHours();
    const currentMinutes = timeInTimezone.getMinutes();
    
    let hourIndex;
    if (currentHour >= 9) {
      hourIndex = currentHour - 9;
    } else {
      hourIndex = currentHour + 15;
    }
    
    const minuteOffset = currentMinutes / 60;
    const position = (hourIndex + minuteOffset) * 72 + 36;
    
    return position;
  };

  // Create week data - only 7 days
  const weekStart = getWeekStart(currentDate);
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(addDays(weekStart, i));
  }
  
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push((9 + i) % 24);
  }

  const today = new Date();
  const todayDateString = today.toDateString();

  // Generate events for the week
  const generateEventsForWeek = () => {
    const weekStart = getWeekStart(currentDate);
    const weekNumber = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    const weekEventSets = [
      {
        google: [
          { day: 1, startHour: getEventHourInTimezone(9), endHour: getEventHourInTimezone(10), title: "Morning Sync", time: "9:00 AM - 10:00 AM", type: "meeting", status: "busy", source: "google" },
          { day: 3, startHour: getEventHourInTimezone(11), endHour: getEventHourInTimezone(12), title: "Team Building", time: "11:00 AM - 12:00 PM", type: "meeting", status: "busy", source: "google" },
          { day: 5, startHour: getEventHourInTimezone(15), endHour: getEventHourInTimezone(16), title: "Code Review", time: "3:00 PM - 4:00 PM", type: "review", status: "busy", source: "google" },
        ],
        iclosed: [
          { day: 2, startHour: getEventHourInTimezone(14), endHour: getEventHourInTimezone(15), title: "Design Workshop", time: "2:00 PM - 3:00 PM", type: "workshop", status: "busy", source: "iclosed" },
          { day: 4, startHour: getEventHourInTimezone(16), endHour: getEventHourInTimezone(17), title: "Code Review Session", time: "4:00 PM - 5:00 PM", type: "session", status: "busy", source: "iclosed" },
        ]
      },
      {
        google: [
          { day: 2, startHour: getEventHourInTimezone(10), endHour: getEventHourInTimezone(11), title: "Project Review", time: "10:00 AM - 11:00 AM", type: "review", status: "busy", source: "google" },
          { day: 4, startHour: getEventHourInTimezone(13), endHour: getEventHourInTimezone(14), title: "Sprint Planning", time: "1:00 PM - 2:00 PM", type: "planning", status: "busy", source: "google" },
        ],
        iclosed: [
          { day: 1, startHour: getEventHourInTimezone(15), endHour: getEventHourInTimezone(16), title: "Architecture Review", time: "3:00 PM - 4:00 PM", type: "review", status: "busy", source: "iclosed" },
        ]
      },
      {
        google: [
          { day: 1, startHour: getEventHourInTimezone(8), endHour: getEventHourInTimezone(9), title: "Daily Standup", time: "8:00 AM - 9:00 AM", type: "meeting", status: "busy", source: "google" },
          { day: 3, startHour: getEventHourInTimezone(12), endHour: getEventHourInTimezone(13), title: "Lunch Meeting", time: "12:00 PM - 1:00 PM", type: "meeting", status: "busy", source: "google" },
          { day: 5, startHour: getEventHourInTimezone(14), endHour: getEventHourInTimezone(15), title: "Weekly Retro", time: "2:00 PM - 3:00 PM", type: "review", status: "busy", source: "google" },
        ],
        iclosed: [
          { day: 2, startHour: getEventHourInTimezone(16), endHour: getEventHourInTimezone(17), title: "Tech Talk", time: "4:00 PM - 5:00 PM", type: "workshop", status: "busy", source: "iclosed" },
          { day: 4, startHour: getEventHourInTimezone(9), endHour: getEventHourInTimezone(10), title: "Design Sprint", time: "9:00 AM - 10:00 AM", type: "session", status: "busy", source: "iclosed" },
        ]
      }
    ];

    const eventSetIndex = weekNumber % weekEventSets.length;
    const currentEventSet = weekEventSets[eventSetIndex];
    
    const googleEvents = currentEventSet.google;
    const iClosedEvents = currentEventSet.iclosed;

    return [...googleEvents, ...iClosedEvents];
  };

  // Initialize events when component mounts or dependencies change
  useEffect(() => {
    setEvents(generateEventsForWeek());
  }, [timezone, currentDate]);

  // Simple mouse handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setStartY(e.pageY);
    setScrollLeft(scrollRef.current.scrollLeft);
    setScrollTop(scrollRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const walkX = startX - e.pageX;
    const walkY = startY - e.pageY;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft + walkX;
      scrollRef.current.scrollTop = scrollTop + walkY;
    }
    if (timeColumnRef.current) {
      timeColumnRef.current.scrollTop = scrollTop + walkY;
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleScroll = (e) => {
    if (timeColumnRef.current) {
      timeColumnRef.current.scrollTop = e.target.scrollTop;
    }
  };

  const handleEventMouseDown = (e, event, dayIndex, hour) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsEventDragging(true);
    setDraggedEvent(event);
    setDragStartPosition({ dayIndex, hour, x: e.clientX, y: e.clientY });
    setDragPreview({
      ...event,
      day: dayIndex % 7,
      startHour: hour,
      endHour: hour + (event.endHour - event.startHour)
    });
  };

  const handleGridMouseMove = (e) => {
    if (!isEventDragging) return;
    
    e.preventDefault();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
         const cellWidth = rect.width / 7;
    const cellHeight = 72;
    
    const dayIndex = Math.floor(x / cellWidth);
    const hourIndex = Math.floor(y / cellHeight);
    const hour = timeSlots[hourIndex] || 9;
    
    const minuteOffset = (y % cellHeight) / cellHeight;
    const rawMinutes = Math.round(minuteOffset * 60);
    const minutes = Math.round(rawMinutes / 15) * 15;
    
         if (isEventDragging && dayIndex >= 0 && dayIndex < 7) {
      const isWeekend = dayIndex % 7 === 0 || dayIndex % 7 === 6;
      const isBreakTime = hour === 13;
      const isWorkingHours = hour >= 9 && hour < 18;
      const isValidPosition = !isWeekend && isWorkingHours && !isBreakTime;
      
      if (isValidPosition) {
        setDragEndPosition({ dayIndex, hour, minutes });
        setDragPreview({
          ...draggedEvent,
          day: dayIndex % 7,
          startHour: hour,
          startMinutes: minutes,
          endHour: hour + (draggedEvent.endHour - draggedEvent.startHour),
          endMinutes: minutes
        });
      } else {
        setDragEndPosition({ dayIndex, hour, minutes, invalid: true });
        setDragPreview({
          ...draggedEvent,
          day: dayIndex % 7,
          startHour: hour,
          startMinutes: minutes,
          endHour: hour + (draggedEvent.endHour - draggedEvent.startHour),
          endMinutes: minutes,
          invalid: true
        });
      }
    }
  };

  const handleGridMouseUp = () => {
    if (isEventDragging && draggedEvent) {
      const wasDragged = dragEndPosition && (
        dragEndPosition.dayIndex !== dragStartPosition?.dayIndex || 
        dragEndPosition.hour !== dragStartPosition?.hour ||
        dragEndPosition.minutes !== dragStartPosition?.minutes
      );
      
      if (wasDragged && dragEndPosition) {
        const isWeekend = dragEndPosition.dayIndex % 7 === 0 || dragEndPosition.dayIndex % 7 === 6;
        const isBreakTime = dragEndPosition.hour === 13;
        const isWorkingHours = dragEndPosition.hour >= 9 && dragEndPosition.hour < 18;
        const isValidPosition = !isWeekend && isWorkingHours && !isBreakTime && !dragEndPosition.invalid;
        
        if (isValidPosition) {
          const updatedEvents = events.filter(event => 
            !(event.day === dragStartPosition.dayIndex % 7 && 
              event.startHour === dragStartPosition.hour &&
              event.title === draggedEvent.title)
          );
          
          const newEvent = {
            ...draggedEvent,
            day: dragEndPosition.dayIndex % 7,
            startHour: dragEndPosition.hour,
            startMinutes: dragEndPosition.minutes || 0,
            endHour: dragEndPosition.hour + (draggedEvent.endHour - draggedEvent.startHour),
            endMinutes: dragEndPosition.minutes || 0,
            title: draggedEvent.title,
            time: `${formatTime(dragEndPosition.hour)}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'} - ${formatTime(dragEndPosition.hour + (draggedEvent.endHour - draggedEvent.startHour))}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'}`,
            type: draggedEvent.type,
            status: draggedEvent.status
          };
          
          setEvents([...updatedEvents, newEvent]);
          console.log('Event moved:', newEvent);
        } else {
          console.log('Cannot drop event in invalid position');
        }
      } else {
        setPopupEvent(draggedEvent);
        setPopupPosition({ 
          x: dragStartPosition.x, 
          y: dragStartPosition.y 
        });
        setIsPopupOpen(true);
      }
    }
    
    setIsEventDragging(false);
    setDraggedEvent(null);
    setDragPreview(null);
    setDragStartPosition(null);
    setDragEndPosition(null);
  };

  // Popup handlers
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setPopupEvent(null);
  };

  const handleMarkAvailable = () => {
    if (popupEvent) {
      const currentStatus = popupEvent.status === 'busy' || !popupEvent.status ? 'busy' : 'available';
      const newStatus = currentStatus === 'busy' ? 'available' : 'busy';
      
      const updatedPopupEvent = { ...popupEvent, status: newStatus };
      setPopupEvent(updatedPopupEvent);
      
      const updatedEvents = events.map(event => 
        event === popupEvent 
          ? updatedPopupEvent
          : event
      );
      setEvents(updatedEvents);
      
      console.log(`Event status changed to ${newStatus}:`, popupEvent.title);
    }
  };

  const handleDeleteEvent = () => {
    if (popupEvent) {
      const updatedEvents = events.filter(event => event !== popupEvent);
      setEvents(updatedEvents);
      console.log('Event deleted:', popupEvent.title);
    }
    handleClosePopup();
  };

  const handleEditEvent = () => {
    if (popupEvent) {
      console.log('Edit event:', popupEvent.title);
    }
    handleClosePopup();
  };

  const handleGrayAreaMouseEnter = (e, dayIndex, hour, type) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex % 7];
    const dayNumber = daysOfWeek[dayIndex].getDate();
    
    // Function to get proper ordinal suffix
    const getOrdinalSuffix = (num) => {
      if (num >= 11 && num <= 13) return 'th';
      switch (num % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    const ordinalSuffix = getOrdinalSuffix(dayNumber);
    
    let info = '';
    if (type === 'break') {
      info = 'Break Time:\n1 PM - 2 PM';
    } else if (type === 'unavailable') {
      if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5) {
        info = `${dayName}, ${dayNumber}${ordinalSuffix} availability:\n09 AM - 06 PM`;
      } else {
        info = `${dayName}, ${dayNumber}${ordinalSuffix} availability:\n-`;
      }
    } else if (type === 'weekend') {
      info = `${dayName}, ${dayNumber}${ordinalSuffix} availability:\n-`;
    }
    
    setHoverInfo(info);
    // Calculate position relative to viewport
    const viewportWidth = window.innerWidth;
    const popupWidth = 200; // Approximate popup width
    
    let x = rect.left + rect.width + 10;
    
    // If popup would go off-screen to the right, position it to the left of the cell
    if (x + popupWidth > viewportWidth) {
      x = rect.left - popupWidth - 10;
    }
    
    setHoverPosition({
      x: x,
      y: rect.top
    });
  };

  const handleGrayAreaMouseLeave = () => {
    setHoverInfo(null);
  };

  // Calculate available slots
  const calculateAvailableSlots = (dayIndex) => {
    const dayOfWeek = dayIndex % 7;
    
    // Weekends (Sunday = 0, Saturday = 6) have 0 available slots
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0;
    }
    
    // Weekdays: 9 AM to 6 PM = 8 hours available (excluding 1-2 PM break)
    const totalAvailableHours = 8;
    
    // Only count events that are "busy" (not "available")
    const busyEvents = events.filter(event => 
      event.day === dayOfWeek && 
      (event.status === 'busy' || !event.status) // Default to busy if no status
    );
    
    let totalEventHours = 0;
    busyEvents.forEach(event => {
      const eventDuration = event.endHour - event.startHour;
      totalEventHours += eventDuration;
    });
    
    const availableSlots = Math.max(0, totalAvailableHours - totalEventHours);
    return availableSlots;
  };

  const availableSlots = daysOfWeek.map((_, dayIndex) => calculateAvailableSlots(dayIndex));

  // Simple variables for rendering
  const cellHeight = 72;
  const timePosition = getCurrentTimePosition();
  const todayColumnIndex = daysOfWeek.findIndex(day => day.toDateString() === todayDateString);
  const isToday = daysOfWeek.some(day => day.toDateString() === todayDateString);

  return (
    <div 
      className="w-full h-full flex flex-col bg-white font-sans text-xs border border-gray-200 overflow-hidden"
      onClick={isPopupOpen ? handleClosePopup : undefined}
    >
      <EventDetailPopup
        event={popupEvent}
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        onMarkAvailable={handleMarkAvailable}
        onDelete={handleDeleteEvent}
        onEdit={handleEditEvent}
        position={popupPosition}
      />
      <div 
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onScroll={handleScroll}
        className={`w-full h-full overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          overflowX: 'auto',
          overflowY: 'auto'
        }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>
        
        <div className="flex flex-col w-full h-full min-w-[1200px] max-w-none">
          <div 
            className="grid border-b border-gray-100 bg-white sticky top-0 z-10"
            style={{ gridTemplateColumns: '80px repeat(7, minmax(140px, 1fr))' }}
          >
            <div className="border-r border-gray-100 p-3 flex-shrink-0"></div>
            {daysOfWeek.map((day, i) => {
              const dayInfo = formatDay(day);
              const isToday = day.toDateString() === todayDateString;
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              
              return (
                <div key={i} className="text-center p-3 border-r border-gray-100 bg-white flex flex-col items-center gap-1 w-full min-w-0">
                  <div className="font-semibold text-gray-700 text-xs tracking-wide flex flex-row items-center justify-center gap-1 min-w-0">
                    <div className={`font-semibold whitespace-nowrap ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {dayInfo.name}
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      isToday 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-transparent text-gray-700'
                    }`}>
                      {dayInfo.number}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 flex min-w-0">
            <div className="flex flex-col sticky left-0 z-50 flex-shrink-0">
              <div
                ref={timeColumnRef}
                className="h-full overflow-y-auto overflow-x-hidden"
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none'
                }}
              >
                <style>{`div::-webkit-scrollbar { display: none; }`}</style>
                {timeSlots.map((hour, i) => (
                  <div key={i} className="flex w-20 h-18 flex-shrink-0">
                    <div className="w-20 border-r border-gray-300 text-sm font-medium text-gray-900 flex items-center justify-end sticky left-0 z-50 bg-white flex-shrink-0"
                         style={{ padding: '19px 12px 4px 10px' }}>
                      <span className="mr-4 mt-5 whitespace-nowrap">{formatTime(hour)}</span>
                      <div className="absolute right-0 bottom-0 w-5 h-px transform -translate-y-1/2">
                        <svg 
                          className="text-gray-600" 
                          width="100%" 
                          height="1" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <line 
                            x1="0" 
                            y1="0" 
                            x2="100%" 
                            y2="0" 
                            stroke="oklch(87.2% 0.01 258.338)" 
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

                         <div 
               className="grid relative z-0 w-full flex-1"
               style={{
                 gridTemplateColumns: 'repeat(7, minmax(140px, 1fr))',
                 minHeight: `${timeSlots.length * cellHeight}px`,
                 minWidth: '1000px',
                 overflow: 'hidden'
               }}
              onMouseMove={handleGridMouseMove}
              onMouseUp={handleGridMouseUp}
            >
              {daysOfWeek.map((day, dayIndex) => {
                const isToday = day.toDateString() === todayDateString;
                const isWeekend = dayIndex % 7 === 0 || dayIndex % 7 === 6;

                                 return (
                   <div key={dayIndex} className={`flex flex-col border-r border-gray-200 relative w-full overflow-hidden min-w-0 ${
                     isWeekend ? 'bg-gray-50' : 'bg-white'
                   }`}>
                     <div className="min-w-full h-18 p-0 border-b border-gray-400 border-r  bg-gray-300 relative z-0"></div>
                    
                    {timeSlots.map((hour, timeIndex) => {
                                             let cellClasses = "min-w-full h-18 p-0 border-b border-gray-300 border-r border-gray-300 bg-white relative z-0 flex-shrink-0";

                       if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5 && hour === 13) {
                         cellClasses = `min-w-full h-18 p-0 border-b border-gray-300 border-r border-gray-300 relative z-0 flex-shrink-0 ${
                           isWeekend ? 'bg-gray-300' : 'bg-white'
                         }`;
                       } else if (hour < 9 || hour >= 18) {
                         cellClasses = "min-w-full h-18 p-0 border-b border-gray-400 border-r border-gray-400 bg-gray-300 relative z-0 flex-shrink-0";
                       } else if (isWeekend) {
                         cellClasses = "min-w-full h-18 p-0 border-b border-gray-400 border-r border-gray-400 bg-gray-300 relative z-0 flex-shrink-0";
                       }

                      const cellStyle = {};
                      if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5 && hour === 13) {
                        cellStyle.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(156, 163, 175, 0.4) 3px, rgba(156, 163, 175, 0.4) 6px)';
                      }

                      return (
                        <div 
                          key={timeIndex} 
                          className={cellClasses} 
                          style={{...cellStyle, position: 'relative'}}
                                                     onMouseEnter={(e) => {
                             if (isWeekend) {
                               handleGrayAreaMouseEnter(e, dayIndex, hour, 'weekend');
                             } else if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5 && hour === 13) {
                               handleGrayAreaMouseEnter(e, dayIndex, hour, 'break');
                             } else if (hour < 9 || hour >= 18) {
                               handleGrayAreaMouseEnter(e, dayIndex, hour, 'unavailable');
                             }
                           }}
                                                     onMouseLeave={handleGrayAreaMouseLeave}
                        >
                          {events.map((event, eventIndex) => {
                            if (event.day === dayIndex % 7 && hour >= event.startHour && hour < event.endHour && hour >= 9 && hour < 18 && !(isEventDragging && draggedEvent && event === draggedEvent)) {
                              const baseEventHeight = (event.endHour - event.startHour) * cellHeight;
                              const eventHeight = Math.max(baseEventHeight, 60);
                              const topOffset = (hour - event.startHour) * cellHeight;
                            
                              if (hour === event.startHour) {
                                let eventClasses = "absolute rounded flex flex-col gap-0.5 cursor-default select-none";
                                                                 let eventStyle = {
                                   top: `${4 + topOffset}px`,
                                   left: '1px',
                                   right: '1px',
                                   height: `${eventHeight - 8}px`,
                                   padding: '4px 6px',
                                   overflow: 'hidden',
                                   zIndex: 10,
                                   width: 'calc(100% - 2px)',
                                   minWidth: '120px'
                                 };

                                if (event.type === 'meeting') {
                                  eventClasses += " bg-emerald-200 border border-emerald-300";
                                } else if (event.type === 'review') {
                                  eventClasses += " bg-lime-200 border border-lime-300";
                                } else if (event.type === 'planning') {
                                  eventClasses += " bg-blue-100 border border-blue-300";
                                } else if (event.type === 'break') {
                                  eventClasses += " bg-gray-100 border border-gray-300";
                                } else if (event.type === 'triage') {
                                  eventClasses += " bg-purple-100 border border-purple-300";
                                } else if (event.type === 'lunch') {
                                  eventClasses += " bg-yellow-100 border border-yellow-300";
                                } else if (event.type === 'workshop') {
                                  eventClasses += " bg-blue-200 border border-blue-300";
                                } else if (event.type === 'session') {
                                  eventClasses += " bg-orange-200 border border-orange-300";
                                } else {
                                  eventClasses += " bg-indigo-100 border border-indigo-300";
                                }

                                return (
                                  <div 
                                    key={eventIndex} 
                                    className={eventClasses} 
                                    style={eventStyle}
                                    onMouseDown={(e) => handleEventMouseDown(e, event, dayIndex, hour)}
                                    onMouseEnter={(e) => e.currentTarget.style.cursor = 'pointer'}
                                    onMouseLeave={(e) => e.currentTarget.style.cursor = 'default'}
                                  >
                                                                         <div className="flex items-center gap-1.5 min-w-0">
                                       {event.source === 'google' && (
                                         <img 
                                           src="/icons/calendar-icon.svg" 
                                           alt="Calendar" 
                                           className="w-4 h-4 flex-shrink-0"
                                         />
                                       )}
                                       <div className={`text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0 ${
                                         event.type === 'meeting' || event.type === 'review' || event.type === 'workshop' || event.type === 'session' ? 'text-gray-800' : 'text-gray-900'
                                       }`}>
                                         {event.title}
                                       </div>
                                     </div>
                                    <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                      event.type === 'meeting' || event.type === 'review' || event.type === 'workshop' || event.type === 'session' ? 'text-gray-600' : 'text-gray-500'
                                    }`}>
                                      {event.time}
                                    </div>
                                    {event.status && (
                                      <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                        event.type === 'meeting' || event.type === 'review' || event.type === 'workshop' || event.type === 'session' ? 'text-gray-600' : 'text-gray-500'
                                      }`}>
                                        {event.status === 'busy' ? 'Busy' : 'Available'}
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return null;
                            }
                            return null;
                          })}
                          
                          {isEventDragging && dragPreview && dragPreview.day === dayIndex % 7 && hour >= dragPreview.startHour && hour < dragPreview.endHour && hour >= 9 && hour < 18 && hour === dragPreview.startHour && dragEndPosition && (
                            <div 
                              className={`absolute left-0 right-0 h-1.5 transition-colors duration-150 ${
                                dragPreview.invalid ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{
                                top: `${4 + (dragPreview.startMinutes || 0) * (cellHeight / 60)}px`,
                                zIndex: 5
                              }}
                            />
                          )}

                          {isEventDragging && dragPreview && dragPreview.day === dayIndex % 7 && hour >= dragPreview.startHour && hour < dragPreview.endHour && hour >= 9 && hour < 18 && hour === dragPreview.startHour && dragEndPosition && (
                            <div 
                              className={`absolute rounded border-2 border-dashed select-none ${
                                dragPreview.invalid 
                                  ? 'border-red-400 bg-red-100 bg-opacity-30' 
                                  : dragPreview.source === 'iclosed'
                                    ? dragPreview.type === 'workshop'
                                      ? 'border-blue-300 bg-blue-200 bg-opacity-30'
                                      : 'border-orange-300 bg-orange-200 bg-opacity-30'
                                    : 'border-emerald-300 bg-emerald-200 bg-opacity-30'
                              }`}
                              style={{
                                top: `${4 + (dragPreview.startMinutes || 0) * (cellHeight / 60)}px`,
                                left: '1px',
                                right: '1px',
                                height: `${Math.max((dragPreview.endHour - dragPreview.startHour) * cellHeight, cellHeight) - 8}px`,
                                padding: '4px 6px',
                                overflow: 'hidden',
                                zIndex: 25,
                                width: 'calc(100% - 2px)',
                                transform: 'rotate(12deg)',
                                backdropFilter: 'blur(2px)',
                                opacity: 0.7
                              }}
                            >
                              <div className="flex items-center gap-1.5">
                                {dragPreview.source === 'google' && (
                                  <img 
                                    src="/icons/calendar-icon.svg" 
                                    alt="Calendar" 
                                    className="w-4 h-4 flex-shrink-0 opacity-60"
                                  />
                                )}
                                <div className={`text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${
                                  dragPreview.invalid 
                                    ? 'text-red-700' 
                                    : dragPreview.source === 'iclosed'
                                      ? dragPreview.type === 'workshop'
                                        ? 'text-blue-800'
                                        : 'text-orange-800'
                                      : 'text-emerald-800'
                                }`}>
                                  {dragPreview.title}
                                </div>
                              </div>
                              <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                dragPreview.invalid 
                                  ? 'text-red-600' 
                                  : dragPreview.source === 'iclosed'
                                    ? dragPreview.type === 'workshop'
                                      ? 'text-blue-700'
                                      : 'text-orange-700'
                                    : 'text-emerald-700'
                              }`}>
                                {`${formatTime(dragPreview.startHour)}:${(dragPreview.startMinutes || 0).toString().padStart(2, '0')} - ${formatTime(dragPreview.endHour)}:${(dragPreview.endMinutes || 0).toString().padStart(2, '0')}`}
                              </div>
                              <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                dragPreview.invalid 
                                  ? 'text-red-600' 
                                  : dragPreview.source === 'iclosed'
                                    ? dragPreview.type === 'workshop'
                                      ? 'text-blue-700'
                                      : 'text-orange-700'
                                    : 'text-emerald-700'
                              }`}>
                                {dragPreview.status === 'busy' ? 'Busy' : 'Available'}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {isToday && dayIndex === todayColumnIndex && timePosition !== null && (
                      <div 
                        className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 pointer-events-none"
                        style={{ top: `${timePosition}px` }}
                      >
                        <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-red-500"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

                     <div 
             className="grid bg-white border-t border-gray-200 sticky bottom-0 z-10"
             style={{ gridTemplateColumns: '80px repeat(7, minmax(140px, 1fr))' }}
           >
            <div className="border-r border-gray-100 bg-white p-3 flex-shrink-0"></div>
            {daysOfWeek.map((day, dayIndex) => {
              const isWeekend = dayIndex % 7 === 0 || dayIndex % 7 === 6;
              
              return (
                                 <div key={dayIndex} className="border-r border-gray-100 px-2.5 py-3 bg-white w-full min-w-0">
                   <div className="text-xs text-gray-500 whitespace-nowrap">
                     Available slots:{' '}
                                          <span className="font-semibold text-gray-700">
                       {availableSlots[dayIndex]}
                     </span>
                   </div>
                 </div>
              );
            })}
          </div>
        </div>
      </div>
      
                    {hoverInfo && (
          <div 
            className="fixed bg-gray-800 text-white p-3 rounded-md shadow-lg border border-gray-600"
            style={{
              zIndex: 999999999,
              left: `${hoverPosition.x}px`,
              top: `${hoverPosition.y}px`,
              whiteSpace: 'pre-line',
              pointerEvents: 'none'
            }}
            
          >
            <div className="text-sm font-medium text-center">
              {hoverInfo.split('\n')[0]}
            </div>
            <div className="text-xs text-center mt-1">
              {hoverInfo.split('\n')[1]}
            </div>
          </div>
        )}
        
    </div>
  );
};

export default CalendarGrid; 