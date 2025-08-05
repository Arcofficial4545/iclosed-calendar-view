import React, { useState } from "react";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import CancelEventModal from "./CancelEventModal";
import RescheduleModal from "./RescheduleModal";

const EventDetailPopup = ({
  event,
  isOpen,
  onClose,
  onMarkAvailable,
  onDelete,
  onEdit,
  position = { x: 0, y: 0 },
}) => {
  // Simple state variables
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);

  if (!isOpen || !event) return null;

  // Simple function to determine status
  const isBusy = event.status === "busy" || !event.status;
  const statusText = isBusy ? "Busy" : "Available";
  const buttonText = isBusy ? "Mark available" : "Mark busy";
  const statusColor = isBusy ? "bg-red-500" : "bg-green-500";

  // Simple function to handle delete click
  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  // Simple function to handle delete confirm
  const handleDeleteConfirm = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  // Simple function to handle delete cancel
  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
  };

  // Simple function to handle cancel event
  const handleCancelEvent = () => {
    setShowCancelModal(true);
  };

  // Simple function to handle cancel event confirm
  const handleCancelEventConfirm = (reason) => {
    onDelete();
    setShowCancelModal(false);
    onClose();
  };

  // Simple function to handle cancel event close
  const handleCancelEventClose = () => {
    setShowCancelModal(false);
  };

  // Simple function to handle reschedule event
  const handleRescheduleEvent = () => {
    setShowRescheduleModal(true);
  };

  // Simple function to handle reschedule event confirm
  const handleRescheduleEventConfirm = (data) => {
    setShowRescheduleModal(false);
    onClose();
  };

  // Simple function to handle reschedule event close
  const handleRescheduleEventClose = () => {
    setShowRescheduleModal(false);
  };

  // Simple function to handle status toggle
  const handleStatusToggle = () => {
    onMarkAvailable();
  };

  // Simple function to get event type icon
  const getEventTypeIcon = (type, source) => {
    if (source === "iclosed") {
      if (type === "workshop") {
        return "/icons/workshop-icon.svg";
      } else if (type === "session") {
        return "/icons/session-icon.svg";
      }
    }
    return "/icons/calendar-icon.svg";
  };

  // Simple function to get event type color
  const getEventTypeColor = (type) => {
    if (type === "meeting") return "bg-emerald-500";
    if (type === "review") return "bg-lime-500";
    if (type === "planning") return "bg-blue-500";
    if (type === "triage") return "bg-orange-500";
    if (type === "lunch") return "bg-yellow-500";
    if (type === "demo") return "bg-purple-500";
    if (type === "retro") return "bg-indigo-500";
    if (type === "talk") return "bg-pink-500";
    if (type === "workshop") return "bg-blue-500";
    if (type === "session") return "bg-orange-500";
    return "bg-gray-500";
  };

  // Simple function to get day name
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

  // Simple function to get month name
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

  // Simple function to format time
  const formatTime = (hour) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  };

  return (
    <>
      {/* Popup */}
      <div
        className="fixed bg-white rounded-lg shadow-xl border border-gray-200 z-50 min-w-80 max-w-96"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -100%)",
          marginTop: "-10px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {event.source === "iclosed" ? (
          // iClosed Event Popup
          <>
            {/* Header with colored vertical bar */}
            <div className="flex items-start justify-between p-4 border-b border-gray-100">
              <div className="flex items-start gap-3">
                {/* Colored vertical bar */}
                <div
                  className={`w-2 h-16 rounded ${
                    event.type === "workshop" ? "bg-blue-500" : "bg-orange-500"
                  }`}
                ></div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {getDayName(event.day)} {getMonthName()}{" "}
                    {new Date().getDate()} • {event.time}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
              >
                ✕
              </button>
            </div>

            {/* Invitee Section */}
            <div className="p-4 border-b border-gray-100">
              <p className="font-semibold text-gray-900 text-sm underline mb-1">
                Invitee {event.type === "workshop" ? "5" : "2"}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-sm">
                  invitee{event.type === "workshop" ? "5" : "2"}@example.com
                </p>
                <button className="px-3 py-1 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 transition-colors">
                  Invitee
                </button>
              </div>
            </div>

            {/* Action Buttons - Cancel and Reschedule */}
            <div className="flex items-center justify-between p-4">
              <button
                onClick={handleCancelEvent}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center">
                  <img
                    src='../../public/icons/delete.svg'
                    alt="delete"
                    className="w-5 h-5"
                  />
                </div>
                Cancel
              </button>
              <button
                onClick={handleRescheduleEvent}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-4 h-4 rounded-full flex items-center justify-center">
                  <img
                    src='../../public/icons/refresh.svg'
                    alt="delete"
                    className="w-5 h-5"
                  />
                </div>
                Reschedule
              </button>
            </div>
          </>
        ) : (
          // Google Event Popup
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm font-semibold ${getEventTypeColor(
                    event.type
                  )}`}
                >
                  <img
                    src={getEventTypeIcon(event.type, event.source)}
                    alt="Calendar"
                    className="w-5 h-5"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {event.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 ${statusColor} text-white text-xs rounded-full font-medium`}
                >
                  {statusText}
                </span>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-2">
                Random event for this week
              </p>
              <p className="text-gray-700 text-sm">
                {getDayName(event.day)} {getMonthName()} {new Date().getDate()}{" "}
                • {event.time}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button 
                onClick={handleStatusToggle}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"></circle>
                    <line x1="6.34" y1="6.34" x2="17.66" y2="17.66" stroke="currentColor" strokeWidth="2" strokeLinecap="round"></line>
                  </svg>
                </div>
                {buttonText}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDeleteClick}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-gray-400"
                  title="Delete event"
                >
                  <img
                    src="../../public/icons/trash.svg"
                    alt="thrash"
                    className="w-4 h-4 flex-shrink-0"
                  />
                </button>
                <button
                  onClick={() => window.open('', '_blank')}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border-2 border-gray-400"
                  title="Edit event"
                >
                  <img
                    src="../../public/icons/external-link.svg"
                    alt="thrash"
                    className="w-4 h-4 flex-shrink-0"
                  />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        eventTitle={event.title}
      />

      {/* Cancel Event Modal */}
      <CancelEventModal
        isOpen={showCancelModal}
        onClose={handleCancelEventClose}
        onConfirm={handleCancelEventConfirm}
        event={event}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={showRescheduleModal}
        onClose={handleRescheduleEventClose}
        onConfirm={handleRescheduleEventConfirm}
        event={event}
      />
    </>
  );
};

export default EventDetailPopup;
