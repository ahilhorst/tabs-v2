import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProjectTab, ProjectTabState } from './ProjectTab';
import { Header } from './Header';
import { NavRail } from './NavRail';

// Image assets
const imgTrafficLights = "http://localhost:3845/assets/3017b24655223fe9fee25951ede3165082a088b1.svg";
const img2 = "http://localhost:3845/assets/3c6cd4bd207e2415c01bd7c1b1df87316d4a10eb.svg";
const img3 = "http://localhost:3845/assets/fad0d92cd5f2872318f49f44398634b2712b8e3e.svg";

export interface Tab {
  id: string;
  label: string;
  state: ProjectTabState;
}

export interface TitleBarProps {
  appName?: string;
  tabs?: Tab[];
  onTabClick?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onAddTab?: () => void;
  onOverflowClick?: () => void;
}

export function TitleBar({ 
  appName = "AppName",
  tabs = [
    { id: "1", label: "ModelName", state: "default" },
    { id: "2", label: "ModelName", state: "active" },
    { id: "3", label: "ModelName", state: "default" },
    { id: "4", label: "ModelName", state: "default" },
    { id: "5", label: "ModelName", state: "default" },
    { id: "6", label: "ModelName", state: "default" },
  ],
  onTabClick,
  onTabClose,
  onAddTab,
  onOverflowClick
}: TitleBarProps) {
  const [activeTabId, setActiveTabId] = useState(tabs.find(tab => tab.state === "active")?.id || tabs[0]?.id);
  const railRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(tabs.length);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const [collapsingTabs, setCollapsingTabs] = useState<Set<string>>(new Set());
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isWindows, setIsWindows] = useState(false);
  const [isNavRailEnabled, setIsNavRailEnabled] = useState(false);
  const [isNavRailExpanded, setIsNavRailExpanded] = useState(false);
  const [isNavRailDragging, setIsNavRailDragging] = useState(false);
  const [navRailDragProgress, setNavRailDragProgress] = useState(0);
  const [isHeaderEnabled, setIsHeaderEnabled] = useState(false);
  const [isNoTabsEnabled, setIsNoTabsEnabled] = useState(false);
  const [showTargets, setShowTargets] = useState(false);
  const configPanelRef = useRef<HTMLDivElement>(null);

  // Recompute how many tabs fit when size changes
  useEffect(() => {
    const compute = (isResize = false) => {
      const rail = railRef.current;
      if (!rail) return;
      
      // Get available width in tabs-wrapper minus space for fixed elements
      const wrapper = rail.parentElement as HTMLElement | null;
      if (!wrapper) return;
      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const reserved = 36 + 36 + 36 + 36 + 12; // dividers + add + overflow buttons
      const available = Math.max(0, wrapperWidth - reserved);
      
      // Calculate how many tabs can fit based on their flex properties
      const gapPx = 4; // gap between tabs
      const minTabWidth = 72; // minimum tab width
      const preferredTabWidth = 120; // preferred tab width
      
      // Try to fit tabs with preferred width first
      let fitCount = Math.floor((available + gapPx) / (preferredTabWidth + gapPx));
      
      // If not all tabs fit with preferred width, try with minimum width
      if (fitCount < tabs.length) {
        fitCount = Math.floor((available + gapPx) / (minTabWidth + gapPx));
      }
      
      const finalCount = Math.max(0, Math.min(fitCount, tabs.length));
      const wasOverflowed = visibleCount < tabs.length;
      const isOverflowed = finalCount < tabs.length;
      
      setVisibleCount(finalCount);
      
      // Only close dropdown during actual window resize, not when tabs are removed
      if (isResize) {
        setIsOverflowOpen(false);
      }
      
      // Only pulse when transitioning from no overflow to overflow (tabs moving into overflow)
      if (!wasOverflowed && isOverflowed) {
        const el = document.querySelector('[data-node-id="1267:98251"]');
        if (el) {
          el.classList.add('pulse');
          window.setTimeout(() => el.classList.remove('pulse'), 200);
        }
      }
    };
    
    compute();
    const ro = new ResizeObserver(() => compute(true)); // Mark as resize
    if (railRef.current) ro.observe(railRef.current.parentElement as Element);
    window.addEventListener('resize', () => compute(true)); // Mark as resize
    return () => {
      window.removeEventListener('resize', () => compute(true));
      ro.disconnect();
    };
  }, [tabs.length, visibleCount]);

  // Close config panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (configPanelRef.current && !configPanelRef.current.contains(event.target as Node)) {
        setIsConfigOpen(false);
      }
    };

    if (isConfigOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isConfigOpen]);

  const { visibleTabs, overflowTabs } = useMemo(() => {
    const vis = tabs.slice(0, visibleCount);
    const of = tabs.slice(visibleCount);
    return { visibleTabs: vis, overflowTabs: of };
  }, [tabs, visibleCount]);

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    onTabClick?.(tabId);
  };

  const handleTabClose = (tabId: string) => {
    // Start collapse animation
    setCollapsingTabs(prev => new Set(prev).add(tabId));
    
    // Remove tab after animation completes
    setTimeout(() => {
      onTabClose?.(tabId);
      setCollapsingTabs(prev => {
        const newSet = new Set(prev);
        newSet.delete(tabId);
        return newSet;
      });
    }, 150);
  };

  const handleOverflowTabClose = (tabId: string) => {
    // Close tab immediately without animation
    onTabClose?.(tabId);
    // Don't close the dropdown - it should stay open
  };

  return (
    <>
                  {/* NavRail */}
                  <NavRail 
                    isEnabled={isNavRailEnabled} 
                    isExpanded={isNavRailExpanded}
                    onExpandChange={setIsNavRailExpanded}
                    onDragStateChange={(isDragging, progress) => {
                      setIsNavRailDragging(isDragging);
                      setNavRailDragProgress(progress);
                    }}
                    showTargets={showTargets}
                  />
      
      <div 
        className={`title-bar ${isWindows ? 'title-bar--windows' : 'title-bar--macos'}`}
        data-name={isWindows ? "titleBarTabs-Windows" : "titleBarTabs-macOS"} 
        data-node-id={isWindows ? "1216:125945" : "1267:98222"}
      >
        {!isWindows && (
          <>
            {/* macOS Traffic Lights - Left Side */}
            <div className="traffic-lights-wrapper" data-name="trafficLightsWrapper" data-node-id="1267:98223">
              <div className="traffic-lights" data-name="trafficLights" data-node-id="1267:98224">
                <button className="traffic-light-button" aria-label="Close">
                  <div className="traffic-light-icon traffic-light-icon--close">
                    <svg viewBox="0 0 10 10" aria-hidden="true">
                      <circle cx="5" cy="5" r="4" fill="#FF5F57" />
                    </svg>
                  </div>
                </button>
                <button className="traffic-light-button" aria-label="Minimize">
                  <div className="traffic-light-icon traffic-light-icon--minimize">
                    <svg viewBox="0 0 10 10" aria-hidden="true">
                      <circle cx="5" cy="5" r="4" fill="#FFBD2E" />
                    </svg>
                  </div>
                </button>
                <button className="traffic-light-button" aria-label="Maximize">
                  <div className="traffic-light-icon traffic-light-icon--maximize">
                    <svg viewBox="0 0 10 10" aria-hidden="true">
                      <circle cx="5" cy="5" r="4" fill="#28CA42" />
                    </svg>
                  </div>
                </button>
              </div>
              <div className="divider" data-name="divider" data-node-id="1267:98228">
                <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0" data-name="dividerWrapper" data-node-id="I1267:98228;21047:28430">
                  <div className="divider-line" data-name="line" data-node-id="I1267:98228;9922:7816" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* App Name */}
        <div className="app-name-wrapper" data-name="appNameWrapper" data-node-id="1267:99040">
          <div className="app-name-label" data-name="labelWrapper" data-node-id="1267:98230">
            <div className="app-name-text" data-name="appNameText" data-node-id="1267:98231">
              <p className="leading-[16px] whitespace-pre">{appName}</p>
            </div>
          </div>
          <div className="divider" data-name="divider" data-node-id="1267:99041">
            <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0" data-name="dividerWrapper" data-node-id="I1267:99041;21047:28430">
              <div className="divider-line" data-name="line" data-node-id="I1267:99041;9922:7816" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        {!isNoTabsEnabled && (
          <div className="tabs-wrapper" data-name="tabsWrapper" data-node-id="1267:98229">
            <div ref={railRef} className="tabs-rail" data-name="tabs-rail" data-node-id="1267:98234">
              {visibleTabs.map((tab) => (
                <ProjectTab
                  key={tab.id}
                  state={tab.id === activeTabId ? "active" : "default"}
                  label={tab.label}
                  onClick={() => handleTabClick(tab.id)}
                  onClose={() => handleTabClose(tab.id)}
                  className={collapsingTabs.has(tab.id) ? "tab--collapsing" : ""}
                />
              ))}
            </div>
            <div className="divider" data-name="divider" data-node-id="1267:98245">
              <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0" data-name="dividerWrapper" data-node-id="I1267:98245;21047:28430">
                <div className="divider-line" data-name="line" data-node-id="I1267:98245;9922:7816" />
              </div>
            </div>
            <div className="add-new-button" data-name="addNew" data-node-id="1267:98246">
              <button 
                className="icon-button" 
                data-name="icon" 
                data-node-id="1267:98247"
                onClick={onAddTab}
                aria-label="Add tab"
                title="Add tab"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
                  <path d="M5 0C5.27614 0 5.5 0.223858 5.5 0.5L5.5 4.5L9.5 4.5C9.77613 4.5 9.99998 4.72387 10 5C10 5.27614 9.77614 5.5 9.5 5.5L5.5 5.5L5.5 9.5C5.5 9.77614 5.27614 10 5 10C4.72386 10 4.5 9.77614 4.5 9.5L4.5 5.5L0.5 5.5C0.223858 5.5 -2.00812e-08 5.27614 0 5C9.36353e-07 4.72386 0.223858 4.5 0.5 4.5L4.5 4.5L4.5 0.5C4.5 0.223858 4.72386 0 5 0Z" fill="#ACB1B7"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Spacer for Tabs off mode */}
        {isNoTabsEnabled && (
          <div className="flex-1" />
        )}

        {/* End Section */}
        <div className="end-wrapper" data-name="endWrapper" data-node-id="1267:98248">
          <div className="divider" data-name="divider" data-node-id="1267:98249">
            <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0" data-name="dividerWrapper" data-node-id="I1267:98249;21047:28430">
              <div className="divider-line" data-name="line" data-node-id="I1267:98249;9922:7816" />
            </div>
          </div>
          <div className="overflow-button" data-name="overflow" data-node-id="1267:98250">
            <button 
              className="icon-button" 
              data-name="recently-closed" 
              data-node-id="1267:98251"
              aria-label="More"
              title="More"
              onClick={() => setIsOverflowOpen(v => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden>
                <path d="M1 0C1.55228 0 2 0.447715 2 1C2 1.55228 1.55228 2 1 2C0.447715 2 0 1.55228 0 1C0 0.447715 0.447715 0 1 0ZM6 0C6.55228 0 7 0.447715 7 1C7 1.55228 6.55228 2 6 2C5.44772 2 5 1.55228 5 1C5 0.447715 5.44772 0 6 0ZM11 0C11.5523 0 12 0.447715 12 1C12 1.55228 11.5523 2 11 2C10.4477 2 10 1.55228 10 1C10 0.447715 10.4477 0 11 0Z" fill="#ACB1B7"/>
              </svg>
            </button>
            {/* Overflow dropdown - only show if there are overflow tabs */}
            {isOverflowOpen && !isNoTabsEnabled && overflowTabs.length > 0 && (
              <div className="overflow-menu" role="menu">
                {overflowTabs.map(tab => (
                  <div key={tab.id} className="overflow-row" role="menuitem">
                    <div className="overflow-left">
                      {/* placeholder icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M3 2C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2H3ZM3 3H13V13H3V3ZM4 4V5H12V4H4ZM4 6V7H12V6H4ZM4 8V9H10V8H4Z" fill="var(--stratakit-color-text-neutral-secondary)"/>
                      </svg>
                    </div>
                    <button className="overflow-label" onClick={() => handleTabClick(tab.id)}>{tab.label}</button>
                    <button className="overflow-dismiss" onClick={() => handleOverflowTabClose(tab.id)} aria-label="Close tab">
                      <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden>
                        <path d="M7.14645 0.146386C7.34171 -0.0488766 7.65822 -0.0488766 7.85348 0.146386C8.04874 0.341648 8.04874 0.658155 7.85348 0.853417L4.70699 3.9999L7.85348 7.14639C8.04874 7.34165 8.04874 7.65815 7.85348 7.85342C7.65822 8.04868 7.34171 8.04868 7.14645 7.85342L3.99996 4.70693L0.853478 7.85342C0.658216 8.04868 0.341709 8.04868 0.146447 7.85342C-0.0488155 7.65815 -0.0488155 7.34165 0.146447 7.14639L3.29293 3.9999L0.146447 0.853417C-0.0488155 0.658155 -0.0488155 0.341648 0.146447 0.146386C0.341709 -0.0488766 0.658216 -0.0488766 0.853478 0.146386L3.99996 3.29287L7.14645 0.146386Z" fill="#ACB1B7"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {isWindows && (
          <>
            {/* Windows Traffic Lights - Right Side */}
            <div className="traffic-lights-wrapper traffic-lights-wrapper--windows" data-name="trafficLightsWrapper" data-node-id="1216:125945">
              <div className="divider" data-name="divider" data-node-id="1216:125946">
                <div className="basis-0 content-stretch flex flex-col grow items-center min-h-px min-w-px relative shrink-0" data-name="dividerWrapper" data-node-id="I1216:125946;21047:28430">
                  <div className="divider-line" data-name="line" data-node-id="I1216:125946;9922:7816" />
                </div>
              </div>
              <div className="traffic-lights traffic-lights--windows" data-name="trafficLights" data-node-id="1216:125947">
                <button className="traffic-light-button" aria-label="Minimize">
                  <svg className="traffic-light-icon" viewBox="0 0 10 10" aria-hidden="true">
                    <line x1="2" y1="5" x2="8" y2="5" />
                  </svg>
                </button>
                <button className="traffic-light-button" aria-label="Maximize">
                  <svg className="traffic-light-icon" viewBox="0 0 10 10" aria-hidden="true">
                    <rect x="2" y="2" width="6" height="6" />
                  </svg>
                </button>
                <button className="traffic-light-button" aria-label="Close">
                  <svg className="traffic-light-icon" viewBox="0 0 10 10" aria-hidden="true">
                    <line x1="2" y1="2" x2="8" y2="8" />
                    <line x1="8" y1="2" x2="2" y2="8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}

      {/* Top border highlight */}
      <div className="absolute inset-0 pointer-events-none shadow-[0px_1px_0px_0px_inset_rgba(255,255,255,0.1)]" />

      {/* Config Panel */}
      <div className="config-panel" ref={configPanelRef}>
        <button 
          className="config-button"
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          aria-label="Settings"
          title="Settings"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
            <path d="M8.23584 1.50439C8.46951 1.5129 8.69998 1.5344 8.92627 1.56689C9.59089 1.66251 9.9497 2.21364 9.99658 2.71436L10.0015 2.81396L10.0112 2.94287C10.0526 3.23987 10.2243 3.51144 10.4995 3.67041L10.6196 3.72998C10.9062 3.84775 11.2261 3.82255 11.4897 3.67432L11.5786 3.62939C12.0047 3.4338 12.6042 3.44978 13.02 3.88135L13.106 3.97998L13.2456 4.16455C13.5643 4.59962 13.8308 5.07642 14.0347 5.58545C14.3009 6.25083 13.9435 6.87333 13.4927 7.14014C13.1949 7.31634 12.9995 7.63641 12.9995 8.00049L13.0083 8.13428C13.0498 8.44076 13.2313 8.70476 13.4917 8.85889C13.9426 9.1257 14.3015 9.74743 14.0356 10.4126C13.8025 10.9951 13.4875 11.536 13.106 12.02C12.6632 12.5813 11.9471 12.5827 11.4907 12.3267C11.1896 12.1574 10.8147 12.1486 10.4995 12.3306C10.1851 12.5124 10.0054 12.8404 10.0015 13.186C9.99542 13.7105 9.6356 14.3304 8.92822 14.4331C8.70239 14.4658 8.47129 14.4869 8.23682 14.4956L8.00049 14.5005C7.6841 14.5005 7.37377 14.4768 7.07178 14.4331C6.36372 14.3307 6.00342 13.7107 5.99756 13.186C5.99437 12.8835 5.8567 12.594 5.61182 12.4048L5.50049 12.3306C5.18544 12.1487 4.81067 12.1573 4.50928 12.3267C4.05286 12.5829 3.33684 12.5812 2.89404 12.02C2.51285 11.5365 2.19754 10.9968 1.96436 10.4146C1.69788 9.74903 2.05643 9.12672 2.50732 8.85986L2.61475 8.7876C2.81759 8.62972 2.95618 8.39748 2.9917 8.13428L3.00049 8.00049C3.00049 7.63659 2.8049 7.31637 2.50732 7.14014C2.05649 6.87333 1.69903 6.2509 1.96533 5.58545C2.19845 5.00348 2.51279 4.46356 2.89404 3.97998C3.30946 3.45317 3.96493 3.41986 4.42139 3.62939L4.51025 3.67432L4.62549 3.72998C4.90305 3.84261 5.22404 3.8292 5.49951 3.67041L5.61084 3.59619C5.8564 3.40687 5.99422 3.11673 5.99756 2.81396C6.00321 2.28946 6.36337 1.66876 7.07275 1.56689L7.30127 1.53857C7.53089 1.51382 7.76429 1.49951 8.00049 1.49951L8.23584 1.50439ZM8.00049 2.50049C7.73379 2.50049 7.47098 2.52028 7.21436 2.55713C7.0855 2.57581 6.99896 2.69447 6.99756 2.82471C6.99019 3.50795 6.63415 4.17021 5.99951 4.53662C5.36545 4.90236 4.61504 4.87981 4.02002 4.54541C3.90658 4.48161 3.75979 4.49693 3.6792 4.59912C3.35621 5.00881 3.09004 5.46571 2.89307 5.95752C2.84498 6.07835 2.9051 6.21255 3.01709 6.27881C3.60527 6.62699 4.00049 7.26763 4.00049 8.00049C4.00022 8.73311 3.60522 9.37331 3.01709 9.72119C2.90503 9.78751 2.84473 9.92159 2.89307 10.0425C3.09002 10.5342 3.35623 10.9912 3.6792 11.4009C3.74979 11.49 3.8711 11.5135 3.97607 11.4751L4.02002 11.4546C4.61542 11.1202 5.36633 11.0982 6.00049 11.4644C6.63465 11.8308 6.99035 12.4924 6.99756 13.1753C6.99916 13.3054 7.08559 13.4251 7.21436 13.4438C7.47095 13.481 7.73376 13.5005 8.00049 13.5005C8.13345 13.5005 8.26546 13.4954 8.396 13.4858L8.78467 13.4438C8.91339 13.4251 8.99981 13.3054 9.00146 13.1753C9.00906 12.4923 9.36531 11.8307 9.99951 11.4644C10.6337 11.0982 11.3847 11.1201 11.98 11.4546C12.0792 11.5101 12.2042 11.5054 12.2876 11.4351L12.3208 11.4009C12.5632 11.0934 12.7737 10.7592 12.9468 10.4038L13.1069 10.0415C13.1492 9.93586 13.1086 9.81935 13.0229 9.74756L12.9829 9.72021C12.3949 9.37251 11.9998 8.73304 11.9995 8.00049C11.9995 7.26747 12.3946 6.62697 12.9829 6.27881C13.0808 6.22086 13.1387 6.11089 13.1196 6.00342L13.1069 5.95752C12.91 5.46579 12.6437 5.00875 12.3208 4.59912C12.2402 4.49695 12.0934 4.48158 11.98 4.54541C11.3848 4.88021 10.6337 4.90262 9.99951 4.53662C9.36508 4.17025 9.00895 3.50793 9.00146 2.82471C9.00021 2.7107 8.93353 2.60491 8.83057 2.56787L8.78467 2.55713C8.52869 2.52035 8.2666 2.50051 8.00049 2.50049ZM7.99951 5.50049C9.38022 5.50049 10.4995 6.61978 10.4995 8.00049C10.4992 9.38098 9.38006 10.5005 7.99951 10.5005C6.61913 10.5003 5.49978 9.38085 5.49951 8.00049C5.49951 6.6199 6.61897 5.50069 7.99951 5.50049ZM7.99951 6.50049C7.17126 6.50069 6.49951 7.17218 6.49951 8.00049C6.49978 8.82857 7.17142 9.50029 7.99951 9.50049C8.82778 9.50049 9.49925 8.82869 9.49951 8.00049C9.49951 7.17206 8.82794 6.50049 7.99951 6.50049Z" fill="#ACB1B7"/>
          </svg>
        </button>
        
        {isConfigOpen && (
          <div className="config-dropdown">
            <div className="config-item">
              <span className="config-label">Platform</span>
              <div className="config-switch">
                <button 
                  className={`switch-option ${!isWindows ? 'active' : ''}`}
                  onClick={() => setIsWindows(false)}
                >
                  macOS
                </button>
                <button 
                  className={`switch-option ${isWindows ? 'active' : ''}`}
                  onClick={() => setIsWindows(true)}
                >
                  Windows
                </button>
              </div>
            </div>
            <div className="config-item">
              <span className="config-label">NavRail</span>
              <div className="toggle-switch">
                <button 
                  className={`toggle-button ${isNavRailEnabled ? 'active' : ''}`}
                  onClick={() => setIsNavRailEnabled(!isNavRailEnabled)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
            <div className="config-item">
              <span className="config-label">Header</span>
              <div className="toggle-switch">
                <button 
                  className={`toggle-button ${isHeaderEnabled ? 'active' : ''}`}
                  onClick={() => setIsHeaderEnabled(!isHeaderEnabled)}
                >
                  <div className="toggle-thumb"></div>
                </button>
              </div>
            </div>
                      <div className="config-item">
                        <span className="config-label">Tabs</span>
                        <div className="toggle-switch">
                          <button 
                            className={`toggle-button ${isNoTabsEnabled ? 'active' : ''}`}
                            onClick={() => setIsNoTabsEnabled(!isNoTabsEnabled)}
                          >
                            <div className="toggle-thumb"></div>
                          </button>
                        </div>
                      </div>
                      <div className="config-item">
                        <span className="config-label">Show targets</span>
                        <div className="toggle-switch">
                          <button 
                            className={`toggle-button ${showTargets ? 'active' : ''}`}
                            onClick={() => setShowTargets(!showTargets)}
                          >
                            <div className="toggle-thumb"></div>
                          </button>
                        </div>
                      </div>
          </div>
        )}
      </div>
    </div>

      {/* Header */}
      <Header 
        hasNavRail={isNavRailEnabled} 
        isNavRailExpanded={isNavRailExpanded}
        isNavRailDragging={isNavRailDragging}
        navRailDragProgress={navRailDragProgress}
        isEnabled={isHeaderEnabled} 
      />
    </>
  );
}
