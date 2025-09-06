import React, { useState, useRef, useEffect } from 'react';

const ActionMenu = ({ actions, triggerClassName = "flex items-center justify-center w-8 h-8 rounded bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action) => {
    action.onClick();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={toggleMenu}
        className={triggerClassName}
        title="Actions"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,140a12,12,0,1,1,12,12A12,12,0,0,1,128,140Zm0-56a12,12,0,1,1,12,12A12,12,0,0,1,128,84Zm0-56a12,12,0,1,1,12,12A12,12,0,0,1,128,28Z"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#dbe0e6] rounded-lg shadow-lg z-20 md:w-48 w-40">
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action)}
                  className={`flex items-center w-full px-4 py-3 text-sm hover:bg-[#f0f2f4] transition-colors ${
                    action.danger ? 'text-[#dc2626] hover:bg-[#fee2e2]' : 'text-[#111418]'
                  }`}
                >
                  <span className="mr-3">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActionMenu;