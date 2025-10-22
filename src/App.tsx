import React, { useState } from 'react';
import { TitleBar, Tab } from './components/TitleBar';
import './styles/design-tokens.css';

function App() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", label: "ModelName", state: "default" },
    { id: "2", label: "ModelName", state: "active" },
    { id: "3", label: "ModelName", state: "default" },
    { id: "4", label: "ModelName", state: "default" },
    { id: "5", label: "ModelName", state: "default" },
    { id: "6", label: "ModelName", state: "default" },
  ]);

  return (
    <div>
      <TitleBar
        appName="Appname"
        tabs={tabs}
        onTabClick={(id) => setTabs(tabs.map(t => ({...t, state: t.id === id ? 'active' : 'default'})))}
        onTabClose={(id) => setTabs(tabs.filter(t => t.id !== id))}
        onAddTab={() => setTabs([...tabs, { id: `tab-${Date.now()}`, label: 'ModelName', state: 'default' }])}
      />
    </div>
  );
}

export default App;
