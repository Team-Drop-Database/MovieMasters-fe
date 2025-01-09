import React, { useState } from "react";

interface SuccessAlertProps {
  message: string;
  onClose?: () => void;
}

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="p-6 bg-green-500 text-white rounded shadow-lg">
        <div className="flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-bold px-2 py-1 bg-white text-green-500 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessAlert;
