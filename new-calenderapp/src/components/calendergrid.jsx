import React, { useState, useRef, useEffect, useMemo } from 'react';
import EventDetailPopup from './EventDetailPopup';

const CalendarGrid = ({ currentDate = new Date(), timezone = 'UTC' }) => {
  // Calendar scrolling and dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  
  // Current time display
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Event drag and drop state
  const [isEventDragging, setIsEventDragging] = useState(false);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [dragStartPosition, setDragStartPosition] = useState(null);
  const [dragEndPosition, setDragEndPosition] = useState(null);
  
  // Event popup state
  const [popupEvent, setPopupEvent] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  // Hover tooltip state
  const [hoverInfo, setHoverInfo] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  
  // Calendar events data
  const [events, setEvents] = useState([]);
  const [showBreakHourConfirm, setShowBreakHourConfirm] = useState(false);
  const [pendingBreakHourDrop, setPendingBreakHourDrop] = useState(null);

  // DOM references for scrolling
  const scrollRef = useRef(null);
  const timeColumnRef = useRef(null);

  // Update current time every 30 seconds based on selected timezone
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

  // Date and time formatting functions
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

  // Convert event hours to display in selected timezone
  const getEventHourInTimezone = (eventHour) => {
    const usaCanadaTimezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto', 'America/Vancouver', 'America/Edmonton', 'America/Winnipeg'];
    const southAmericaTimezones = ['America/Sao_Paulo', 'America/Argentina/Buenos_Aires', 'America/Santiago', 'America/Lima', 'America/Bogota', 'America/Caracas'];

    let isUsaCanada = false;
    for (let i = 0; i < usaCanadaTimezones.length; i++) {
      if (timezone === usaCanadaTimezones[i]) {
        isUsaCanada = true;
        break;
      }
    }

    let isSouthAmerica = false;
    for (let i = 0; i < southAmericaTimezones.length; i++) {
      if (timezone === southAmericaTimezones[i]) {
        isSouthAmerica = true;
        break;
      }
    }

    if (isUsaCanada || isSouthAmerica) {
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

  // Generate 7 days starting from Sunday
  const weekStart = getWeekStart(currentDate);
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    daysOfWeek.push(addDays(weekStart, i));
  }
  
  // Generate 24-hour time slots (9 AM to 8 AM next day)
  const timeSlots = [];
  for (let i = 0; i < 24; i++) {
    timeSlots.push(9 + i);
  }

  const today = new Date();
  const todayDateString = today.toDateString();

  // Generate different event sets that rotate weekly
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
    
    const allEvents = [];
    for (let i = 0; i < currentEventSet.google.length; i++) {
      allEvents.push(currentEventSet.google[i]);
    }
    for (let i = 0; i < currentEventSet.iclosed.length; i++) {
      allEvents.push(currentEventSet.iclosed[i]);
    }

    return allEvents;
  };

  // Load events when timezone or date changes
  useEffect(() => {
    setEvents(generateEventsForWeek());
  }, [timezone, currentDate]);

  // Calendar scrolling handlers
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

  // Event drag and drop handlers
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
      const isWorkingHours = hour >= 9 && hour < 18;
      const isValidPosition = !isWeekend && isWorkingHours;
      
      if (isValidPosition) {
        // Check for event conflicts
        const newEventDay = dayIndex % 7;
        const newEventStartHour = hour;
        const newEventEndHour = hour + (draggedEvent.endHour - draggedEvent.startHour);
        const hasConflict = hasEventConflict(newEventDay, newEventStartHour, newEventEndHour, draggedEvent);
        
        setDragEndPosition({ dayIndex, hour, minutes, invalid: hasConflict });
        setDragPreview({
          ...draggedEvent,
          day: newEventDay,
          startHour: newEventStartHour,
          startMinutes: minutes,
          endHour: newEventEndHour,
          endMinutes: minutes,
          invalid: hasConflict
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
        const isWorkingHours = dragEndPosition.hour >= 9 && dragEndPosition.hour < 18;
        const isValidPosition = !isWeekend && isWorkingHours && !dragEndPosition.invalid;
        
        if (isValidPosition) {
          // Calculate new event details
          const newEventDay = dragEndPosition.dayIndex % 7;
          const newEventStartHour = dragEndPosition.hour;
          const newEventEndHour = dragEndPosition.hour + (draggedEvent.endHour - draggedEvent.startHour);
          
          // Check for event conflicts
          const hasConflict = hasEventConflict(newEventDay, newEventStartHour, newEventEndHour, draggedEvent);
          
          if (hasConflict) {
            // Don't allow drop if there's a conflict
            return;
          }
          
          // Check if this is a break hour (1 PM)
          if (dragEndPosition.hour === 13) {
            // Show confirmation dialog for break hour
            setPendingBreakHourDrop({
              draggedEvent,
              dragStartPosition,
              dragEndPosition
            });
            setShowBreakHourConfirm(true);
          } else {
            // Normal drop for non-break hours
            const updatedEvents = [];
            for (let i = 0; i < events.length; i++) {
              const event = events[i];
              if (!(event.day === dragStartPosition.dayIndex % 7 && 
                    event.startHour === dragStartPosition.hour &&
                    event.title === draggedEvent.title)) {
                updatedEvents.push(event);
              }
            }
            
            const newEvent = {
              ...draggedEvent,
              day: newEventDay,
              startHour: newEventStartHour,
              startMinutes: dragEndPosition.minutes || 0,
              endHour: newEventEndHour,
              endMinutes: dragEndPosition.minutes || 0,
              title: draggedEvent.title,
              time: `${formatTime(newEventStartHour)}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'} - ${formatTime(newEventEndHour)}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'}`,
              type: draggedEvent.type,
              status: draggedEvent.status
            };
            
            updatedEvents.push(newEvent);
            setEvents(updatedEvents);
          }
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

  // Show tooltip when hovering over unavailable time slots
  const handleGrayAreaMouseEnter = (e, dayIndex, hour, type) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex % 7];
    const dayNumber = daysOfWeek[dayIndex].getDate();
    
    const getOrdinalSuffix = (num) => {
      if (num >= 11 && num <= 13) return 'th';
      const lastDigit = num % 10;
      if (lastDigit === 1) return 'st';
      if (lastDigit === 2) return 'nd';
      if (lastDigit === 3) return 'rd';
      return 'th';
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
    const viewportWidth = window.innerWidth;
    const popupWidth = 200;
    
    let x = rect.left + rect.width + 10;
    
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

  // Event popup handlers
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
      
      const updatedEvents = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event === popupEvent) {
          updatedEvents.push(updatedPopupEvent);
        } else {
          updatedEvents.push(event);
        }
      }
      setEvents(updatedEvents);
    }
  };

  const handleDeleteEvent = () => {
    if (popupEvent) {
      const updatedEvents = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event !== popupEvent) {
          updatedEvents.push(event);
        }
      }
      setEvents(updatedEvents);
    }
    handleClosePopup();
  };

  const handleEditEvent = () => {
    handleClosePopup();
  };

  // Break hour confirmation handlers
  const handleBreakHourConfirm = () => {
    if (pendingBreakHourDrop) {
      const { draggedEvent, dragStartPosition, dragEndPosition } = pendingBreakHourDrop;
      
      // Calculate new event details
      const newEventDay = dragEndPosition.dayIndex % 7;
      const newEventStartHour = dragEndPosition.hour;
      const newEventEndHour = dragEndPosition.hour + (draggedEvent.endHour - draggedEvent.startHour);
      
      // Check for event conflicts
      const hasConflict = hasEventConflict(newEventDay, newEventStartHour, newEventEndHour, draggedEvent);
      
      if (hasConflict) {
        // Don't allow drop if there's a conflict
        setShowBreakHourConfirm(false);
        setPendingBreakHourDrop(null);
        return;
      }
      
      const updatedEvents = [];
      for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (!(event.day === dragStartPosition.dayIndex % 7 && 
              event.startHour === dragStartPosition.hour &&
              event.title === draggedEvent.title)) {
          updatedEvents.push(event);
        }
      }
      
      const newEvent = {
        ...draggedEvent,
        day: newEventDay,
        startHour: newEventStartHour,
        startMinutes: dragEndPosition.minutes || 0,
        endHour: newEventEndHour,
        endMinutes: dragEndPosition.minutes || 0,
        title: draggedEvent.title,
        time: `${formatTime(newEventStartHour)}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'} - ${formatTime(newEventEndHour)}:${dragEndPosition.minutes?.toString().padStart(2, '0') || '00'}`,
        type: draggedEvent.type,
        status: draggedEvent.status
      };
      
      updatedEvents.push(newEvent);
      setEvents(updatedEvents);
    }
    
    setShowBreakHourConfirm(false);
    setPendingBreakHourDrop(null);
  };

  const handleBreakHourCancel = () => {
    setShowBreakHourConfirm(false);
    setPendingBreakHourDrop(null);
  };

  // Check if there's a conflict with existing events
  const hasEventConflict = (day, startHour, endHour, excludeEvent = null) => {
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      
      // Skip the event we're moving (if it's the same event)
      if (excludeEvent && event.day === excludeEvent.day && 
          event.startHour === excludeEvent.startHour && 
          event.title === excludeEvent.title) {
        continue;
      }
      
      // Check if events overlap on the same day
      if (event.day === day) {
        // Check if the new event overlaps with existing event
        const newEventStartsBeforeExistingEnds = startHour < event.endHour;
        const newEventEndsAfterExistingStarts = endHour > event.startHour;
        
        if (newEventStartsBeforeExistingEnds && newEventEndsAfterExistingStarts) {
          return true; // Conflict found
        }
      }
    }
    return false; // No conflict
  };

  // Calculate how many hours are available for scheduling each day
  const calculateAvailableSlots = (dayIndex) => {
    const dayOfWeek = dayIndex % 7;
    
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return 0;
    }
    
    const totalAvailableHours = 8;
    
    const busyEvents = [];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event.day === dayOfWeek && (event.status === 'busy' || !event.status)) {
        busyEvents.push(event);
      }
    }
    
    let totalEventHours = 0;
    for (let i = 0; i < busyEvents.length; i++) {
      const event = busyEvents[i];
      const eventDuration = event.endHour - event.startHour;
      totalEventHours += eventDuration;
    }
    
    const availableSlots = Math.max(0, totalAvailableHours - totalEventHours);
    return availableSlots;
  };

  const availableSlots = [];
  for (let i = 0; i < daysOfWeek.length; i++) {
    availableSlots.push(calculateAvailableSlots(i));
  }

  // Visual layout constants
  const cellHeight = 72;
  const [currentTimeState, setCurrentTimeState] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeState(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const timePosition = useMemo(() => {
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
    const position = (hourIndex + minuteOffset) * 72 + 72;
    
    return position;
  }, [currentTimeState, timezone]);
  
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

      {/* Break Hour Confirmation Dialog */}
      {showBreakHourConfirm && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl border border-gray-200 z-50">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Break Hour Warning</h3>
          </div>
          
          <p className="text-gray-700 mb-6">
            You're trying to schedule an event during break hours (1:00 PM - 2:00 PM). 
            This time is typically reserved for lunch breaks.
          </p>
          
          <p className="text-gray-700 mb-6">
            Are you sure you want to schedule this event during break time?
          </p>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleBreakHourCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleBreakHourConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Yes, Schedule Anyway
            </button>
          </div>
        </div>
      )}
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
            <div className="flex flex-col sticky left-0 z-50 flex-shrink-0 border-r border-gray-300 bg-white">
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
                  <div key={i} className="w-20 h-18 flex-shrink-0 relative" style={{ overflow: 'visible', zIndex: 100 - i }}>
                    <div className="w-20 h-full bg-white sticky left-0 " style={{ overflow: 'visible', zIndex: 44, paddingTop: '4px' }}>
                      <span className="absolute text-sm font-medium whitespace-nowrap leading-none" style={{ bottom: '-7px', right: '32px', zIndex: 100, transform: 'translateY(-2px)', color: '#4B5563' }}>{formatTime(hour)}</span>
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-px" style={{ zIndex: 75 }}>
                      <svg width="30%" height="2" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginLeft: 'auto' }}>
                        <line x1="0" y1="1" x2="100%" y2="1" stroke="#E5E7EB" strokeWidth="2" />
                      </svg>
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
                  <div key={dayIndex} className={`flex flex-col border-r border-gray-300 relative w-full overflow-hidden min-w-0 ${
                    isWeekend ? 'bg-gray-50' : 'bg-white'
                  }`}>
                    <div className="min-w-full h-18 p-0 border-b border-r relative z-0" style={{ backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' }}></div>
                    
                    {timeSlots.map((hour, timeIndex) => {
                      let cellClasses = "min-w-full h-18 p-0 border-b border-r bg-white relative z-0 flex-shrink-0";
                      const cellStyle = { borderColor: '#E5E7EB' };

                      if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5 && hour === 13) {
                        cellClasses = `min-w-full h-18 p-0 border-b border-r relative z-0 flex-shrink-0 ${
                          isWeekend ? 'bg-white' : 'bg-white'
                        }`;
                      } else if (hour < 9 || hour >= 18) {
                        cellClasses = "min-w-full h-18 p-0 border-b border-r relative z-0 flex-shrink-0";
                        cellStyle.backgroundColor = '#F3F4F6';
                      } else if (isWeekend) {
                        cellClasses = "min-w-full h-18 p-0 border-b border-r relative z-0 flex-shrink-0";
                        cellStyle.backgroundColor = '#F3F4F6';
                      } else {
                        cellClasses = "min-w-full h-18 p-0 border-b border-r bg-white relative z-0 flex-shrink-0";
                      }
                      
                      if (dayIndex % 7 >= 1 && dayIndex % 7 <= 5 && hour === 13) {
                        // Only show break pattern if no event is being dragged over this cell
                        if (!isEventDragging || dragPreview?.day !== dayIndex % 7 || 
                            dragPreview?.startHour !== hour) {
                          cellStyle.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(156, 163, 175, 0.4) 3px, rgba(156, 163, 175, 0.4) 6px)';
                        } else {
                          // Show normal background when dragging over break hour
                          cellStyle.backgroundColor = '#FFFFFF';
                          cellStyle.backgroundImage = 'none';
                        }
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

                                if (event.source === 'google') {
                                  eventStyle.backgroundColor = '#F3F4F6';
                                  eventStyle.border = '1px solid #D1D5DB';
                                } else if (event.source === 'iclosed') {
                                  const isOrangeScheme = event.type === 'workshop' || event.type === 'session' || event.title.includes('Workshop') || event.title.includes('Session');
                                  
                                  if (isOrangeScheme) {
                                    eventStyle.backgroundColor = '#FFF0E5';
                                    eventStyle.border = '1px solid #D1D5DB';
                                    eventStyle.borderLeft = '3px solid #FF8630';
                                  } else {
                                    eventStyle.backgroundColor = '#EBF1FF';
                                    eventStyle.border = '1px solid #D1D5DB';
                                    eventStyle.borderLeft = '3px solid #6F97FF';
                                  }
                                } else {
                                  eventStyle.backgroundColor = '#F3F4F6';
                                  eventStyle.border = '1px solid #D1D5DB';
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
                                      <div className="text-xs font-semibold overflow-hidden text-ellipsis whitespace-nowrap flex-1 min-w-0 text-gray-800">
                                        {event.title}
                                      </div>
                                    </div>
                                    <div className="text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">
                                      {event.time}
                                    </div>
                                    {event.status && (
                                      <div className="text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap text-gray-600">
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
                                  : dragPreview.startHour === 13
                                    ? 'border-red-400 bg-red-50 bg-opacity-50'
                                    : dragPreview.source === 'iclosed'
                                      ? (dragPreview.type === 'workshop' || dragPreview.type === 'session' || dragPreview.title.includes('Workshop') || dragPreview.title.includes('Session'))
                                        ? 'border-orange-300 bg-orange-100 bg-opacity-30'
                                        : 'border-blue-300 bg-blue-100 bg-opacity-30'
                                      : 'border-gray-300 bg-gray-100 bg-opacity-30'
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
                                    : dragPreview.startHour === 13
                                      ? 'text-red-800'
                                      : dragPreview.source === 'iclosed'
                                        ? (dragPreview.type === 'workshop' || dragPreview.type === 'session' || dragPreview.title.includes('Workshop') || dragPreview.title.includes('Session'))
                                          ? 'text-orange-800'
                                          : 'text-blue-800'
                                        : 'text-gray-800'
                                }`}>
                                  {dragPreview.title}
                                </div>
                              </div>
                              <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                dragPreview.invalid 
                                  ? 'text-red-600' 
                                  : dragPreview.startHour === 13
                                    ? 'text-red-700'
                                    : dragPreview.source === 'iclosed'
                                      ? (dragPreview.type === 'workshop' || dragPreview.type === 'session' || dragPreview.title.includes('Workshop') || dragPreview.title.includes('Session'))
                                        ? 'text-orange-700'
                                        : 'text-blue-700'
                                      : 'text-gray-600'
                              }`}>
                                {`${formatTime(dragPreview.startHour)}:${(dragPreview.startMinutes || 0).toString().padStart(2, '0')} - ${formatTime(dragPreview.endHour)}:${(dragPreview.endMinutes || 0).toString().padStart(2, '0')}`}
                              </div>
                              <div className={`text-xs leading-tight overflow-hidden text-ellipsis whitespace-nowrap ${
                                dragPreview.invalid 
                                  ? 'text-red-600' 
                                  : dragPreview.startHour === 13
                                    ? 'text-red-700'
                                    : dragPreview.source === 'iclosed'
                                      ? (dragPreview.type === 'workshop' || dragPreview.type === 'session' || dragPreview.title.includes('Workshop') || dragPreview.title.includes('Session'))
                                        ? 'text-orange-700'
                                        : 'text-blue-700'
                                      : 'text-gray-600'
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
                  {!isWeekend && (
                    <div className="text-xs text-gray-500 whitespace-nowrap">
                      Available slots:{' '}
                      <span className="font-semibold text-gray-700">
                        {availableSlots[dayIndex]}
                      </span>
                    </div>
                  )}
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