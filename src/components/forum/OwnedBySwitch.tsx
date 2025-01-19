import React from "react";

interface OwnedBySwitchProps {
  ownedByMe: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const OwnedBySwitch: React.FC<OwnedBySwitchProps> = ({ ownedByMe, onChange }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <span className="text-sm sm:text-base">
        <span className="hidden sm:inline mr-2">Show my threads</span>
        <span className="sm:hidden">My threads</span>
      </span>
      <div className="relative">
        <input
          type="checkbox"
          checked={ownedByMe}
          onChange={onChange}
          className="sr-only"
        />
        <div
          className={`block w-14 h-8 rounded-full shadow-md transition-colors ${ownedByMe ? "bg-blue-800" : "bg-gray-500"}`}
        />
        <div
          className={`dot absolute left-1 top-1.5 bg-white w-5 h-5 rounded-full transition-transform ${ownedByMe ? "transform translate-x-6 bg-white" : ""}`}
        />
      </div>
    </label>
  );
};

export default OwnedBySwitch;
