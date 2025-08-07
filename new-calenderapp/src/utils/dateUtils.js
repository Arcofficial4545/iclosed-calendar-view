// Shared date utility functions to eliminate duplication

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const result = new Date(date);
  result.setDate(result.getDate() - day);
  return result;
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatDate = (date) => {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

export const formatShortDate = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  return `${month} ${day}`;
};

export const isCurrentDay = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear();
};

export const isSameMonth = (date1, date2) => {
  return date1.getMonth() === date2.getMonth() && 
         date1.getFullYear() === date2.getFullYear();
};

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatDay = (date) => {
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayIndex = date.getDay();
  const dayNumber = date.getDate();
  const formattedDayNumber = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
  return {
    name: dayNames[dayIndex],
    number: formattedDayNumber
  };
};

export const formatTime = (hour) => {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    hour12: true
  });
};
