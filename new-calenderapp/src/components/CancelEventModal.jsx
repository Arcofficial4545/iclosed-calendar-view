import React, { useState } from 'react';

const CancelEventModal = ({ isOpen, onClose, onConfirm, event }) => {
  const [cancelReason, setCancelReason] = useState('');

  if (!isOpen || !event) return null;

  const handleConfirm = () => {
    onConfirm(cancelReason);
    setCancelReason('');
  };

  const handleClose = () => {
    setCancelReason('');
    onClose();
  };

  const getDayName = (day) => {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return dayNames[day];
  };

  const getMonthName = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  };

  return (
    <>
      {/* Modal */}
             <div 
         className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-gray-200 z-60 min-w-[250px] max-w-[300px]"
         onClick={(e) => e.stopPropagation()}
       >
                 {/* Header */}
         <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Cancel this event?</h2>
          <button
            onClick={handleClose}
            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          >
            ✕
          </button>
        </div>

                 {/* Event Details Card */}
         <div className="p-3 bg-gray-50 mx-3 mt-3 rounded-lg">
          <div className="flex items-start gap-3">
            {/* Colored vertical bar */}
            <div
              className={`w-1 h-12 rounded ${
                event.type === "workshop" ? "bg-blue-500" : "bg-orange-500"
              }`}
            ></div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-base">
                {event.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {getDayName(event.day)} {getMonthName()} {new Date().getDate()} • {event.time}
              </p>
            </div>
          </div>

          {/* Participants */}
          <div className="mt-4 space-y-3">
            {/* Host */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" 
  style={{ background: 'radial-gradient(circle, #031953, #002DA4)' }}>
                  Z
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Zack Bing</p>
                  <p className="text-xs text-gray-600">zack.bing@iclosed.io</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded">Host</span>
            </div>

            {/* Invitee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-semibold">
                  J
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Jerry Sienfeld</p>
                  <p className="text-xs text-gray-600">jerry@gmail.com</p>
                </div>
              </div>
              <span className="px-2 py-1 text-xs text-gray-600 bg-gray-200 rounded">Invitee</span>
            </div>
          </div>
        </div>

                 {/* Reason for Canceling */}
         <div className="p-3">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Reason for canceling? (Optional)
          </label>
                     <textarea
             value={cancelReason}
             onChange={(e) => setCancelReason(e.target.value)}
             placeholder="Enter reason for cancelling"
             className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
           />
          <p className="text-xs text-gray-500 mt-2">
            Cancellation email will be sent to the invitee.
          </p>
        </div>

                 {/* Action Buttons */}
         <div className="flex items-center justify-between p-3 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
                     <button
             onClick={handleConfirm}
             className="px-6 py-2 text-sm font-medium text-white rounded-md transition-colors"
             style={{ background: 'radial-gradient(circle, #031953, #002DA4)' }}
           >
             Cancel event
           </button>
                 </div>
       </div>
     </>
   );
 };

export default CancelEventModal; 