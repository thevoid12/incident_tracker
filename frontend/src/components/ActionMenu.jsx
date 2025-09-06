import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const ActionMenu = ({ actions, triggerClassName = "flex items-center justify-center w-8 h-8 rounded bg-[#f0f2f4] hover:bg-[#e5e7eb] transition-colors" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  const toggleMenu = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const menuHeight = actions.length * 40 + 16;

      let top = rect.bottom + window.scrollY;
      if (spaceBelow < menuHeight && spaceAbove > spaceBelow) {
        top = rect.top + window.scrollY - menuHeight;
      }

      setMenuPosition({
        top: top,
        left: rect.right + window.scrollX - 192 // 192px = w-48 (12rem)
      });
    }
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
        ref={buttonRef}
        onClick={toggleMenu}
        className={triggerClassName}
        title="Actions"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,140a12,12,0,1,1,12,12A12,12,0,0,1,128,140Zm0-56a12,12,0,1,1,12,12A12,12,0,0,1,128,84Zm0-56a12,12,0,1,1,12,12A12,12,0,0,1,128,28Z"></path>
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            className="fixed w-48 bg-white border border-[#dbe0e6] rounded-lg shadow-lg z-[9999]"
            style={{
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`
            }}
          >
            <div className="py-1">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleAction(action)}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-[#f0f2f4] transition-colors ${
                    action.danger ? 'text-[#dc2626] hover:bg-[#fee2e2]' : 'text-[#111418]'
                  }`}
                >
                  <span className="mr-3">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
};

export default ActionMenu;