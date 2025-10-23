import React from 'react';

interface ExpandButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  showTargets?: boolean;
}

export function ExpandButton({ isExpanded, onClick, showTargets = false }: ExpandButtonProps) {
  return (
    <div className={`nav-rail-expand-button ${showTargets ? 'nav-rail-expand-button--debug' : ''}`} onClick={onClick}>
      <div className="nav-rail-expand-icon">
        <svg 
          width="10" 
          height="10" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className={isExpanded ? 'expanded' : ''}
        >
          <path 
            d="M4.5 3L7.5 6L4.5 9" 
            stroke="var(--stratakit-color-icon-neutral-base)" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
