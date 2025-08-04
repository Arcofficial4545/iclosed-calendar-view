import React, { useState } from 'react';

const RescheduleModal = ({ isOpen, onClose, onConfirm, event }) => {
  const [rescheduleOption, setRescheduleOption] = useState('manual');
  const [selectedCloser, setSelectedCloser] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  if (!isOpen || !event) return null;

  const handleConfirm = () => {
    onConfirm({ option: rescheduleOption, closer: selectedCloser });
    setSelectedCloser('');
    setRescheduleOption('manual');
  };

  const handleClose = () => {
    setSelectedCloser('');
    setRescheduleOption('manual');
    setShowDropdown(false);
    onClose();
  };

  const closers = ['Closer 1', 'Closer 2', 'Closer 3'];

  return (
    <>
      {/* Modal */}
             <div 
         className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-gray-200 z-60 min-w-[300px] max-w-[350px]"
         onClick={(e) => e.stopPropagation()}
       >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Reschedule Call</h2>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Round Robin Option */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="rescheduleOption"
                value="roundRobin"
                checked={rescheduleOption === 'roundRobin'}
                onChange={(e) => setRescheduleOption(e.target.value)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Round Robin</div>
                <div className="text-sm text-gray-600 mt-1">
                  The call will automatically be scheduled to the best available closer
                </div>
              </div>
            </label>
          </div>

          {/* Select Manually Option */}
          <div className="mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="rescheduleOption"
                value="manual"
                checked={rescheduleOption === 'manual'}
                onChange={(e) => setRescheduleOption(e.target.value)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">Select Manually</div>
                <div className="text-sm text-gray-600 mt-1">
                  You can add a call in the past as well by selecting the closer manually
                </div>
                
                {/* Dropdown for manual selection */}
                {rescheduleOption === 'manual' && (
                  <div className="mt-3 ml-6 relative">
                    <div
                      className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between"
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <span className={selectedCloser ? 'text-gray-900' : 'text-gray-500'}>
                        {selectedCloser || 'Select closer'}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    
                    {/* Dropdown Options */}
                    {showDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                        {closers.map((closer) => (
                          <div
                            key={closer}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                            onClick={() => {
                              setSelectedCloser(closer);
                              setShowDropdown(false);
                            }}
                          >
                            {closer}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Schedule Call
          </button>
        </div>
      </div>
    </>
  );
};

export default RescheduleModal; 