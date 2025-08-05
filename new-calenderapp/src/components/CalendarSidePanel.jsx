import React, { useState } from "react";
import { createPortal } from "react-dom";
import EventsDropdown from "./EventsDropdown"
const CalendarSidePanel = ({ selectedMembers, setSelectedMembers, onBackArrowClick, sidebarExpanded }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentOption, setCurrentOption] = useState('My Schedule');
  const [searchValue, setSearchValue] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState('Events');
  const [showAvailabilityPopup, setShowAvailabilityPopup] = useState(false);
  const [isSpecificEventSelected, setIsSpecificEventSelected] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState('Default availabiliy');
  const [availabilitySearchValue, setAvailabilitySearchValue] = useState('');

  const emails = [
    "zack.bing@gmail.com",
    "jane.doe@gmail.com",
    "system@iclosed.io",
  ];

  const members = [
    'Member 1',
    'Member 2',
    'Member 3', 
    'Member 4',
    'Member 5',
    'Member 6'
  ];

  const handleCheckbox = (email) => {
    if (selectedMembers.includes(email)) {
      setSelectedMembers(selectedMembers.filter(item => item !== email));
    } else {
      setSelectedMembers([...selectedMembers, email]);
    }
  };

  const selectMember = (member) => {
    setCurrentOption(member);
    setShowDropdown(false);
    setSearchValue('');
  };

  const filterOptions = ['Events', 'Meetings', 'Tasks'];

  const availabilityOptions = [
    { id: 'default', name: 'Default availabiliy', isDefault: true },
    { id: 'long', name: 'Long name for availability sc...', isDefault: false },
    { id: 'availability3', name: 'Availability 3', isDefault: false }
  ];

  const searchResults = members.filter(member =>
    member.toLowerCase().includes(searchValue.toLowerCase())
  );

  const filteredAvailabilityOptions = availabilityOptions.filter(option =>
    option.name.toLowerCase().includes(availabilitySearchValue.toLowerCase())
  );

  const handleMouseEnter = () => {
    console.log('Sidebar expanded:', sidebarExpanded);
    const popupLeft = sidebarExpanded ? '280px' : '239px';
    console.log('Popup position:', popupLeft);
    setShowAvailabilityPopup(true);
  };

  const handleMouseLeave = () => {
    setShowAvailabilityPopup(false);
  };

  const handleEventSelectionChange = (hasSpecificEvent) => {
    setIsSpecificEventSelected(hasSpecificEvent);
  };



     return (
     <div className="w-full bg-white py-4 h-full overflow-y-auto min-w-0 relative">
      <div className="flex items-center mb-3  mt-4 pb-3 border-b border-gray-200 min-w-0">
        <div className="flex items-center flex-shrink-0">
        <svg 
          className="w-5 h-5 text-gray-600 mr-2 cursor-pointer hover:text-gray-800 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          onClick={onBackArrowClick}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <h2 className="font-medium text-lg text-gray-900 whitespace-nowrap">Calendar view</h2>
      </div>
      </div>

      <div className="space-y-4 text-sm px-4 min-w-0">
        <div className="min-w-0">
          <label className="block mb-2 text-sm font-medium text-gray-900 whitespace-nowrap">View Schedule for</label>
          <div className="relative min-w-0">
            <div 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer flex justify-between items-center bg-white min-w-0"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span className="text-gray-900 truncate">{currentOption}</span>
              <svg 
                className={`w-4 h-4 text-gray-500 flex-shrink-0 ${showDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                
                <div className="bg-blue-50 px-3 py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-900">My Schedule</span>
                </div>

                <div className="px-3 py-2 text-sm text-gray-600 border-b border-gray-100">
                  Filter by member
                </div>

                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search by member name"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  {searchResults.map((member, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
                      onClick={() => selectMember(member)}
                    >
                      <img
                        src="/icons/selectavatar.svg"
                        alt="member avatar"
                        className="w-6 h-6 mr-3"
                      />
                      <span className="text-sm text-gray-900">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <label className="block mb-1 text-sm font-medium text-gray-900 whitespace-nowrap">Filter by</label>
          <div className="relative min-w-0">
            <div 
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm cursor-pointer flex justify-between items-center bg-white min-w-0"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <span className="text-gray-900 truncate">{filter}</span>
              <svg 
                className={`w-4 h-4 text-gray-500 flex-shrink-0 ${filterOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {filterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900" 
                  onClick={() => {setFilter('Events'); setFilterOpen(false)}}
                >
                  Events
                </div>
                <div 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900" 
                  onClick={() => {setFilter('Availability'); setFilterOpen(false)}}
                >
Availability                </div>
                <div 
                  className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-900" 
                  onClick={() => {setFilter('Tasks'); setFilterOpen(false)}}
                >
                  Tasks
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Availability Dropdown - Only show when "Availability" is selected */}
        {filter === 'Availability' && (
          <div className="min-w-0">
            <label className="block mb-1 text-sm font-medium text-gray-900 whitespace-nowrap">Availability</label>
            <div className="relative min-w-0">
              <div 
                className="w-full border border-blue-300 rounded-md px-3 py-2 text-sm cursor-pointer flex justify-between items-center bg-white min-w-0"
                onClick={() => setShowAvailabilityDropdown(!showAvailabilityDropdown)}
              >
                <span className="text-gray-900 truncate">{selectedAvailability}</span>
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-4 h-4 text-gray-400 cursor-pointer" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <svg 
                    className={`w-4 h-4 text-gray-500 flex-shrink-0 ${showAvailabilityDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {showAvailabilityDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        placeholder="Search availability"
                        value={availabilitySearchValue}
                        onChange={(e) => setAvailabilitySearchValue(e.target.value)}
                        className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
                      />
                    </div>
                  </div>

                  <div className="max-h-48 overflow-y-auto">
                    {filteredAvailabilityOptions.map((option, i) => (
                      <div
                        key={i}
                        className="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                        onClick={() => {
                          setSelectedAvailability(option.name);
                          setShowAvailabilityDropdown(false);
                          setAvailabilitySearchValue('');
                        }}
                      >
                        <div className="flex items-center">
                          <div className="w-4 h-4 border border-gray-300 rounded-full mr-3 flex items-center justify-center">
                            {selectedAvailability === option.name && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                                                     {option.isDefault && (
                             <svg className="w-4 h-4 mr-2" fill="#6B7280" viewBox="0 0 20 20">
                               <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                             </svg>
                           )}
                          <span className="text-sm text-gray-900">{option.name}</span>
                        </div>
                        <svg 
                          className="w-4 h-4 text-gray-400" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    ))}
                  </div>

                  <div className="p-3 border-t border-gray-100 flex justify-end gap-2">
                    <button 
                      className="px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50"
                      onClick={() => {
                        setShowAvailabilityDropdown(false);
                        setAvailabilitySearchValue('');
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      onClick={() => {
                        setShowAvailabilityDropdown(false);
                        setAvailabilitySearchValue('');
                      }}
                    >
                      Apply filter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div>
         <EventsDropdown onEventSelectionChange={handleEventSelectionChange}/>
        </div>

        {isSpecificEventSelected && (
          <>
            <div className="mt-4">
              <h3 className="font-medium text-gray-500 text-xs mb-1">EVENT DURATION</h3>
              <p className="text-sm text-gray-900 mb-3">60 minutes</p>
            </div>

            <div className="relative">
              <h3 className="font-medium text-gray-500 text-xs mb-1 flex items-center">
                AVAILABILITY SCHEDULE
                             <div className="relative inline-block">
                   <svg 
                     className="w-3 h-3 ml-1 text-gray-400 cursor-pointer" 
                     fill="none" 
                     stroke="currentColor" 
                     viewBox="0 0 24 24"
                     onMouseEnter={handleMouseEnter}
                     onMouseLeave={handleMouseLeave}
                   >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   
                   
                 </div>
              </h3>
              <p className="text-sm text-gray-900 mb-3">Default availability</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500 text-xs mb-1">SLOTS AVAILABLE FOR WEEK</h3>
              <p className="text-sm text-gray-900 mb-3">26</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500 text-xs mb-1">WEEKLY OCCUPANCY</h3>
              <p className="text-sm text-gray-900 mb-4">24%</p>
            </div>
          </>
        )}

        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-2">Connected calendar(s)</h3>
          <p className="text-xs text-gray-500 mb-3">Checking for scheduling conflicts. Enable or disable event visibility.</p>
          <div className="space-y-2">
            {emails.map((email, index) => (
              <label
                key={index}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedMembers.includes(email)}
                  onChange={() => handleCheckbox(email)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300"
                />
                <img
                  src="/icons/calendar-icon.svg"
                  alt="calendar icon"
                  className="w-4 h-4"
                />
                <span className="text-gray-900">{email}</span>
              </label>
            ))}
          </div>
                          </div>
                </div>
                  {/* Availability popup code*/}
         {showAvailabilityPopup && createPortal(
           <div 
             className="fixed bg-gray-900 rounded-md shadow-lg min-w-55 text-white opacity-100" 
                           style={{
                zIndex: 9999999999,
                left: sidebarExpanded ? '280px' : '239px',
                top: '370px',
                visibility: 'visible',
                display: 'block',
                position: 'fixed',
                pointerEvents: 'auto'
              }}
           >
                     <div className="text-sm font-medium text-center p-3 bg-gray-700 rounded-t-md">Default availability</div>
                                          <div className="p-3 relative">
                        <div className="absolute left-1/5 top-0 bottom-0 w-px bg-gray-600 transform -translate-x-1/2"></div>
                                                <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Mon</span>
                           <span className="text-xs col-span-4 text-center">9 AM - 5 PM</span>
                         </div>
                         <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Tue</span>
                           <span className="text-xs col-span-4 text-center">9 AM - 5 PM</span>
                         </div>
                         <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Wed</span>
                           <span className="text-xs col-span-4 text-center">9 AM - 5 PM</span>
                         </div>
                         <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Thu</span>
                           <span className="text-xs col-span-4 text-center">9 AM - 5 PM</span>
                         </div>
                         <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Fri</span>
                           <span className="text-xs col-span-4 text-center">9 AM - 5 PM</span>
                         </div>
                         <div className="grid grid-cols-5 border-b border-gray-600 pb-2 mb-2">
                           <span className="text-xs">Sat</span>
                           <span className="text-xs col-span-4 text-center">-</span>
                         </div>
                         <div className="grid grid-cols-5">
                           <span className="text-xs">Sun</span>
                           <span className="text-xs col-span-4 text-center">-</span>
                         </div>
                      </div>
                     <div className="absolute -left-1 top-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                   </div>,
           document.body
         )}
       </div>
     );
   };

export default CalendarSidePanel;