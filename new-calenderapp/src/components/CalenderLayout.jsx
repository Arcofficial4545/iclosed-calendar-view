import React, { useState } from 'react';
import Sidebar from './sidebar';
import Topbar from './Topbar';
import CalendarGrid from './calendergrid';
import CalendarSidePanel from './CalendarSidePanel';

const CalendarLayout = ({
  currentDate,
  setCurrentDate,
  calendarMonth,
  setCalendarMonth,
  goToPreviousWeek,
  goToNextWeek,
  timezone,
  setTimezone,
  selectedMembers,
  setSelectedMembers
}) => {
  // Simple state variables
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  
  // Simple function to toggle side panel
  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };
  
  // Simple function to handle calendar icon click
  const handleCalendarIconClick = () => {
    setIsSidePanelOpen(true);
  };

  return (
    <>
      <Sidebar 
        onCalendarIconClick={handleCalendarIconClick} 
        onSidebarStateChange={setSidebarExpanded}
      />

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden h-screen">
        {/* Side Panel */}
        <div
          className={`transition-all duration-300 bg-white border-r border-gray-100
            ${isSidePanelOpen ? 'w-80' : 'w-0'} overflow-hidden`}
        >
          {isSidePanelOpen && (
            <CalendarSidePanel
              selectedMembers={selectedMembers}
              setSelectedMembers={setSelectedMembers}
              onBackArrowClick={toggleSidePanel}
              sidebarExpanded={sidebarExpanded}
            />
          )}
        </div>

        {/* Calendar area */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Topbar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            calendarMonth={calendarMonth}
            setCalendarMonth={setCalendarMonth}
            goToPreviousWeek={goToPreviousWeek}
            goToNextWeek={goToNextWeek}
            timezone={timezone}
            setTimezone={setTimezone}
          />
          <div className="flex-grow overflow-hidden overflow-x-auto min-w-0">
            <CalendarGrid currentDate={currentDate} timezone={timezone} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarLayout;