import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, Search } from 'lucide-react';
import timezoneOptions from '../utils/timezoneOptions';

const TimezoneSelector = ({ timezone, setTimezone, onTimezoneChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Find the current timezone label from the options
  const getCurrentTimezoneLabel = () => {
    for (const region of timezoneOptions) {
      const option = region.options.find(opt => opt.value === timezone);
      if (option) return option.label;
    }
    return 'Pakistan Standard Time'; // fallback
  };

  const [selectedLabel, setSelectedLabel] = useState(getCurrentTimezoneLabel());

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

  const handleTimezoneSelect = (timezoneValue, timezoneLabel) => {
    setTimezone(timezoneValue); // Update parent component
    setSelectedLabel(timezoneLabel);
    setIsOpen(false);
    setSearchText('');
    
    // Call additional callback if provided
    if (onTimezoneChange) {
      onTimezoneChange(timezoneValue);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setSearchText('');
  };

  const filteredTimezones = timezoneOptions.map(region => ({
    ...region,
    options: region.options.filter(option => 
      option.label.toLowerCase().includes(searchText.toLowerCase())
    )
  })).filter(region => region.options.length > 0);

  return (
    <div className="relative w-full z-50 bg-white">
      {/* Main Selector Button */}
      <div 
        className="flex items-center justify-between p-3 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 min-w-[320px]"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-900">
            {selectedLabel}{currentTime}
          </span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full min-w-[320px] bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full mt-1">
          {/* Search Bar */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2 p-2 border border-gray-300 rounded">
              <Search className="w-4 h-4 text-gray-400" />
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
                  // Get current time for this timezone
                  const optionTime = new Date().toLocaleTimeString('en-US', {
                    timeZone: option.value,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                  });

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