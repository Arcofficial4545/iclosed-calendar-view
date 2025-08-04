import React from "react";

// Custom colors for each member
const memberColors = {
  "John Legend": "bg-orange-500",
  "Jerry Seinfeld": "bg-green-500",
  "George Costanza": "bg-red-500",
  "System": "bg-indigo-500",
};

const FilterCheckboxList = ({ members, selected, onToggle }) => {
  return (
    <div className="space-y-2 mt-6">
      <h2 className="text-sm font-semibold text-gray-300 mb-2">Filter by Member</h2>
      {members.map((member) => (
        <label key={member} className="flex items-center gap-2 text-sm text-white">
          <input
            type="checkbox"
            checked={selected.includes(member)}
            onChange={() => onToggle(member)}
          />
          <span
            className={`inline-block w-3 h-3 rounded-full ${memberColors[member] || "bg-gray-300"}`}
          ></span>
          <span>{member}</span>
        </label>
      ))}
    </div>
  );
};

export default FilterCheckboxList;
