import React, { useState, useEffect } from 'react';
import timezoneOptions from '../utils/timezoneOptions';

const TimezoneSelector = ({ timezone, setTimezone, onTimezoneChange }) => {
  // Simple state variables
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Simple function to find current timezone label
  const getCurrentTimezoneLabel = () => {
    for (let i = 0; i < timezoneOptions.length; i++) {
      const region = timezoneOptions[i];
      for (let j = 0; j < region.options.length; j++) {
        const option = region.options[j];
        if (option.value === timezone) {
          return option.label;
        }
      }
    }
    return 'Pakistan Standard Time';
  };

  const [selectedLabel, setSelectedLabel] = useState(getCurrentTimezoneLabel());

  // Simple function to update clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCurrentTime(now);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Simple function to handle timezone selection
  const handleTimezoneSelect = (timezoneValue, timezoneLabel) => {
    setTimezone(timezoneValue);
    setSelectedLabel(timezoneLabel);
    setIsOpen(false);
    setSearchText('');
    
    if (onTimezoneChange) {
      onTimezoneChange(timezoneValue);
    }
  };

  // Simple function to handle toggle
  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchText('');
  };

  // Simple function to filter timezones
  const getFilteredTimezones = () => {
    const filtered = [];
    
    for (let i = 0; i < timezoneOptions.length; i++) {
      const region = timezoneOptions[i];
      const filteredOptions = [];
      
      for (let j = 0; j < region.options.length; j++) {
        const option = region.options[j];
        if (option.label.toLowerCase().includes(searchText.toLowerCase())) {
          filteredOptions.push(option);
        }
      }
      
      if (filteredOptions.length > 0) {
        filtered.push({
          ...region,
          options: filteredOptions
        });
      }
    }
    
    return filtered;
  };

  const filteredTimezones = getFilteredTimezones();

  // Simple function to get time for a timezone
  const getTimeForTimezone = (timezoneValue) => {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezoneValue,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="relative w-full z-50 bg-white">
      {/* Main Selector Button */}
      <div 
        className="flex items-center p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 min-w-[320px]"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 flex-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
            <path d="M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14M14 8C14 6.4087 13.3679 4.88258 12.2426 3.75736C11.1174 2.63214 9.5913 2 8 2M14 8H2M8 14C6.4087 14 4.88258 13.3679 3.75736 12.2426C2.63214 11.1174 2 9.5913 2 8M8 14C9.10467 14 10 11.3133 10 8C10 4.68667 9.10467 2 8 2M8 14C6.89533 14 6 11.3133 6 8C6 4.68667 6.89533 2 8 2M8 2C6.4087 2 4.88258 2.63214 3.75736 3.75736C2.63214 4.88258 2 6.4087 2 8" stroke="#6B7280" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span className="text-sm font-medium text-gray-900">
            {selectedLabel}{currentTime}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ml-2 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full min-w-[320px] bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full mt-1">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by city or region..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full text-sm outline-none text-gray-600 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Timezone List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredTimezones.map((region, regionIndex) => (
              <div key={regionIndex}>
                {/* Region Header */}
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 uppercase">
                  {region.label}
                </div>
                
                {/* Timezone Options */}
                {region.options.map((option, optionIndex) => {
                  const optionTime = getTimeForTimezone(option.value);

                  return (
                    <div
                      key={optionIndex}
                      className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                        timezone === option.value ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleTimezoneSelect(option.value, option.label)}
                    >
                      <span className="text-sm text-gray-900">{option.label}</span>
                      <span className="text-sm text-gray-600">{optionTime}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            
            {filteredTimezones.length === 0 && (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No timezones found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;