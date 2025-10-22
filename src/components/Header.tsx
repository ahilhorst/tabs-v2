import React from 'react';

interface BreadcrumbItem {
  id: string;
  label: string;
  href?: string;
}

interface HeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  hasNavRail?: boolean;
  isEnabled?: boolean;
}

export function Header({ 
  breadcrumbs = [
    { id: "1", label: "Level one" },
    { id: "2", label: "Level two" },
    { id: "3", label: "Level three" }
  ],
  onBreadcrumbClick,
  hasNavRail = false,
  isEnabled = false
}: HeaderProps) {
  return (
    <div className={`header ${hasNavRail ? 'header--with-nav-rail' : ''} ${isEnabled ? 'header--visible' : ''}`}>
      <div className="header-content">
        {/* Select dropdown placeholder */}
        <div className="header-select">
          <div className="select-placeholder">
            <div className="select-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M7.25 1.85535C7.71403 1.58752 8.28598 1.5875 8.75 1.85535L12.9463 4.2782C13.4102 4.54613 13.6962 5.04131 13.6963 5.57703V10.4227C13.6962 10.9585 13.4102 11.4536 12.9463 11.7216L8.75 14.1444C8.28597 14.4123 7.71405 14.4122 7.25 14.1444L3.05371 11.7216C2.58974 11.4536 2.30378 10.9585 2.30371 10.4227V5.57703C2.30381 5.04126 2.58973 4.54611 3.05371 4.2782L7.25 1.85535ZM3.30371 10.4227C3.30378 10.6012 3.39919 10.766 3.55371 10.8553L7.5 13.1337V8.17468L3.30371 5.75183V10.4227ZM8.5 8.17468V13.1337L12.4463 10.8553C12.6008 10.766 12.6962 10.6012 12.6963 10.4227V5.75183L8.5 8.17468ZM8.25 2.72156C8.09535 2.63233 7.90464 2.63232 7.75 2.72156L3.90137 4.94324L8 7.30945L12.0977 4.94324L8.25 2.72156Z" fill="#808791"/>
              </svg>
            </div>
            <span>iTwin title</span>
            <div className="select-caret">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M9.6464 9.14679C9.84166 8.95154 10.1582 8.95154 10.3534 9.14679C10.5485 9.34207 10.5486 9.65862 10.3534 9.85382L8.35343 11.8538C8.15823 12.0489 7.84165 12.0489 7.6464 11.8538L5.6464 9.85382C5.45117 9.65859 5.45123 9.34206 5.6464 9.14679C5.84166 8.95154 6.15817 8.95154 6.35343 9.14679L7.99991 10.7933L9.6464 9.14679ZM7.99991 4.00031C8.13248 4.00034 8.25969 4.05305 8.35343 4.14679L10.3534 6.14679C10.5485 6.34206 10.5486 6.65862 10.3534 6.85382C10.1582 7.04892 9.84164 7.04886 9.6464 6.85382L7.99991 5.20734L6.35343 6.85382C6.15822 7.04892 5.84164 7.04886 5.6464 6.85382C5.45117 6.65859 5.45123 6.34206 5.6464 6.14679L7.6464 4.14679L7.72257 4.08429C7.8041 4.02995 7.90049 4.00031 7.99991 4.00031Z" fill="#808791"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="header-divider">
          <div className="divider-line" />
        </div>

        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => (
            <div key={item.id} className="breadcrumb-item">
              {index > 0 && (
                <svg 
                  className="breadcrumb-separator" 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="8" 
                  height="8" 
                  viewBox="0 0 8 8" 
                  fill="none" 
                  aria-hidden="true"
                >
                  <path d="M2.5 1L5.5 4L2.5 7" stroke="var(--stratakit-color-text-neutral-secondary)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
              <button 
                className={`breadcrumb-link ${index === breadcrumbs.length - 1 ? 'breadcrumb-current' : ''}`}
                onClick={() => onBreadcrumbClick?.(item)}
                disabled={index === breadcrumbs.length - 1}
              >
                {item.label}
              </button>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
