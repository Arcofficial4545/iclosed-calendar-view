import React, { useState } from 'react';

const Sidebar = ({ onCalendarIconClick }) => {
  const [currentActive, setCurrentActive] = useState("calendar");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const topIcons = [
    { file: "1.svg", id: "collapse", label: "collapse" },
    { file: "calendar2.svg", id: "calendar", label: "AI Schedular" },
    { file: "globe-alt3.svg", id: "globe", label: "Global Data" },
    { file: "view-grid4.svg", id: "grid", label: "Analytics" },
    { file: "current-location5.svg", id: "location", label: "Tracking" },
    { file: "users6.svg", id: "users", label: "Members" }
  ];

  const bottomIcons = [
    { file: "book-open7.svg", id: "book", label: "Documentation" },
    { file: "cube-transparent8.svg", id: "cube", label: "Integrations" },
    { file: "cog9.svg", id: "settings", label: "Settings" }
  ];

  const handleIconClick = (iconId) => {
    setCurrentActive(iconId);

    if (iconId === "calendar") {
      onCalendarIconClick?.();
    }

    if (iconId === "collapse") {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleBottomIconClick = (iconId) => {
    setCurrentActive(iconId);
  };

  return (
    <div
      className={`h-screen text-white flex flex-col py-4 transition-all duration-300 ${
        sidebarOpen ? 'w-64 px-4 items-start justify-start' : 'w-16 items-center justify-start'
      }`}
      style={{
        background: 'linear-gradient(135deg, #13255D 0%, #04012A 100%)'
      }}
    >
      {/* Logo and Top Icons */}
      <div className={`flex flex-col ${sidebarOpen ? 'w-full' : 'items-center'} gap-6 cursor-pointer`}>
        
        {/* Logo */}
        <div className={`flex items-center gap-2 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
          <img
            src="/icons/iclosedicon1.svg"
            alt="logo"
            className='h-6 w-6 cursor-pointer'
          />
          {sidebarOpen && <span className="text-lg font-semibold">iClosed</span>}
        </div>

        {/* Top Menu Icons */}
        <div className='flex flex-col gap-2 mt-4 w-full'>
          {topIcons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleIconClick(icon.id)}
              className={`flex items-center gap-3 rounded-md py-2 px-3 w-full transition-all ${
                currentActive === icon.id ? "bg-[#2D2B52]" : "hover:bg-[#1E1C3A]"
              }`}
            >
              <img
                src={`/icons/${icon.file}`}
                alt={icon.id}
                className='w-5 h-5 opacity-80'
              />
              {sidebarOpen && <span className="text-sm">{icon.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Icons and Profile */}
      <div className={`flex flex-col gap-4 ${sidebarOpen ? 'w-full px-1 items-start' : 'items-center'} mt-auto`}>
        
        {/* Bottom Menu Icons */}
        <div className='flex flex-col gap-2 w-full'>
          {bottomIcons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleBottomIconClick(icon.id)}
              className={`flex items-center gap-3 rounded-md py-2 px-3 w-full transition-all ${
                currentActive === icon.id ? "bg-[#2D2B52]" : "hover:bg-[#1E1C3A]"
              }`}
            >
              <img
                src={`/icons/${icon.file}`}
                alt={icon.id}
                className='w-5 h-5 opacity-80'
              />
              {sidebarOpen && <span className="text-sm">{icon.label}</span>}
            </button>
          ))}
        </div>

        {/* User Profile */}
        <div
          className={`flex items-center justify-between px-3 py-1 text-white text-sm font-semibold cursor-pointer transition-all border border-white/20 ${
            sidebarOpen ? 'w-full rounded-md bg-transparent' : 'w-11 h-11 justify-center rounded-full bg-blue-600'
          }`}
        >
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-xs font-bold">
                  A
                </div>
                <span>ARC</span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 opacity-80"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          ) : (
            <span className="text-sm font-bold">A</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;