import React, { useState } from 'react';
import Sidebar from './sidebar';
import Topbar from './Topbar';
import CalendarGrid from './calendergrid';
import CalendarSidePanel from './CalendarSidePanel';

const CalendarLayout = ({
  currentDate,
  setCurrentDate,
  goToPreviousWeek,
  goToNextWeek,
  timezone,
  setTimezone,
  selectedMembers,
  setSelectedMembers
}) => {
  const [isSidePanelOpen, setisSidePanelOpen] = useState(true); // Always open by default
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const toggleSidePanel = () => {
    console.log('Toggle side panel called, current state:', isSidePanelOpen);
    setisSidePanelOpen((prev) => !prev);
  };
  
  const handleCalendarIconClick = () => {
    // When calendar icon is clicked, always ensure side panel is open
    console.log('Calendar icon clicked - setting side panel to open');
    setisSidePanelOpen(true);
  };

  return (
    <>
      <Sidebar 
        onCalendarIconClick={handleCalendarIconClick} 
        onSidebarStateChange={setSidebarExpanded}
      />

      {/* Entire right area: SidePanel + Topbar+CalendarGrid together */}
      <div className="flex-1 flex overflow-hidden h-screen">
        {/* Side Panel (full height) */}
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

        {/* Topbar and CalendarGrid shrink together */}
        <div className="flex flex-col flex-1 overflow-hidden min-w-0">
          <Topbar
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
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