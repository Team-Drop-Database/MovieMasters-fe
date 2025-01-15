"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

type DropdownProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

const Dropdown: React.FC<DropdownProps> = ({ isOpen, onClose, children }) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  // Dynamically create a portal container and append it to the body
  useEffect(() => {
    const portalDiv = document.createElement("div");
    portalDiv.setAttribute("id", "dropdown-portal");
    document.body.appendChild(portalDiv);
    setPortalElement(portalDiv);

    return () => {
      document.body.removeChild(portalDiv);
    };
  }, []);

  if (!isOpen || !portalElement) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white shadow-lg rounded-lg mt-2 p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalElement
  );
};

export default Dropdown;
