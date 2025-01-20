import React, { useState } from "react";

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
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
      <div className="p-6 bg-red-500 text-white rounded shadow-lg">
        <div className="flex items-center justify-between flex-col">
          <span className="font-bold">Something went wrong:</span>
          <span>{message}</span>
          <button
            onClick={handleClose}
            className="ml-4 text-sm font-bold px-2 py-1 bg-white text-black rounded self-end mt-4"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;
