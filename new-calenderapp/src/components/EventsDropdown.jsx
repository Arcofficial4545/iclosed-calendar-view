import React, { useState } from 'react';

const EventsDropdown = ({ onEventSelectionChange }) => {
  // Simple state variables
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(['All events']);

  // Simple array of events
  const events = [
    { name: 'All events', description: '' },
    { name: 'Team Standup', description: 'Random event 1 for this month' },
    { name: 'Architecture Review', description: 'Random event 2 for this month' },
    { name: 'Product Planning', description: 'Random event 3 for this month' },
    { name: 'Bug Triage', description: 'Random event 4 for this month' },
    { name: 'User Research Call', description: 'Random event 5 for this month' },
    { name: 'Technical Discussion', description: 'Random event 6 for this month' }
  ];

  // Simple function to filter events
  const getFilteredEvents = () => {
    const filtered = [];
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event.name.toLowerCase().includes(searchText.toLowerCase())) {
        filtered.push(event);
      }
    }
    return filtered;
  };

  const filteredEvents = getFilteredEvents();

  // Simple function to handle event click
  const handleEventClick = (eventName) => {
    if (eventName === 'All events') {
      setSelectedEvents(['All events']);
      onEventSelectionChange(false);
    } else {
      let newSelection = [];
      
      // Remove 'All events' from selection
      for (let i = 0; i < selectedEvents.length; i++) {
        if (selectedEvents[i] !== 'All events') {
          newSelection.push(selectedEvents[i]);
        }
      }

      // Check if event is already selected
      let isAlreadySelected = false;
      for (let i = 0; i < newSelection.length; i++) {
        if (newSelection[i] === eventName) {
          isAlreadySelected = true;
          break;
        }
      }

      if (isAlreadySelected) {
        // Remove event from selection
        const updatedSelection = [];
        for (let i = 0; i < newSelection.length; i++) {
          if (newSelection[i] !== eventName) {
            updatedSelection.push(newSelection[i]);
          }
        }
        newSelection = updatedSelection;
        
        if (newSelection.length === 0) {
          newSelection = ['All events'];
          onEventSelectionChange(false);
        } else {
          onEventSelectionChange(true);
        }
      } else {
        // Add event to selection
        newSelection.push(eventName);
        onEventSelectionChange(true);
      }

      setSelectedEvents(newSelection);
    }
  };

  // Simple function to get display text
  const getDisplayText = () => {
    let hasAllEvents = false;
    for (let i = 0; i < selectedEvents.length; i++) {
      if (selectedEvents[i] === 'All events') {
        hasAllEvents = true;
        break;
      }
    }
    
    if (hasAllEvents) {
      return 'All events';
    }
    
    if (selectedEvents.length === 1) {
      return selectedEvents[0];
    }
    
    return `${selectedEvents.length} events selected`;
  };

  // Simple function to check if event is selected
  const isEventSelected = (eventName) => {
    for (let i = 0; i < selectedEvents.length; i++) {
      if (selectedEvents[i] === eventName) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full max-w-md min-w-0">
      <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">
        Event(s)
      </label>

      <div className="relative min-w-0">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer flex justify-between items-center bg-white min-w-0"
        >
          <span className="text-gray-900 truncate">{getDisplayText()}</span>
          <svg className={`w-5 h-5 text-gray-600 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by event name"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {filteredEvents.map((event, index) => (
                <div key={index} className="px-4 py-2 hover:bg-gray-50 cursor-pointer" onClick={() => handleEventClick(event.name)}>

                  {event.name === 'All events' ? (
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 mt-1 rounded-full border-2 flex items-center justify-center ${isEventSelected(event.name) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                        {isEventSelected(event.name) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{event.name}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center ${isEventSelected(event.name) ? 'border-blue-600' : 'border-gray-300'} bg-white`}>
                        {isEventSelected(event.name) && (
                          <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mt-1">
                        <img src="/icons/eventdropicon.svg" alt="" className="w-4 h-4" />
                      </div>
                      <div className="w-1 h-8 bg-green-500 rounded-full mt-1"></div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900">{event.name}</div>
                        {event.description && (
                          <div className="text-xs text-gray-500 mt-1">{event.description}</div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 border-t border-gray-100">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Apply filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDropdown;