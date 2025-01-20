import React from "react";
import {Button} from "@/components/generic/Button";

interface SortDropdownProps {
  sortOption: string;
  onSortChange: (option: string) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ sortOption, onSortChange, isDropdownOpen, toggleDropdown }) => {
  return (
    <div className="relative inline-block">
      <Button onClick={toggleDropdown} text="Sort" className="rounded-md"/>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-background_secondary rounded-lg shadow-lg z-50">
          {["Newest", "Oldest", "Most Popular", "Least Popular", "A-Z", "Z-A"].map((option, index, array) => (
            <p
              key={option}
              className={`cursor-pointer px-4 py-2 text-sm ${sortOption === option ? "bg-blue-800 text-white" : "hover:bg-background_primary"}
              ${index === 0 ? "rounded-t-lg" : ""}
              ${index === array.length - 1 ? "rounded-b-lg" : ""}`}
              onClick={() => onSortChange(option)}
            >
              {option}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
