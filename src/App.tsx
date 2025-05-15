import { useState } from 'react';
import { Layout } from './components/Layout';
import { AIToolsDashboard } from './components/AIToolsDashboard';
import { AIMentorBot } from './components/tools/AIMentorBot';
import { MarketResearchAssistant } from './components/tools/MarketResearchAssistant';
import { CoFounderSimulator } from './components/tools/CoFounderSimulator';

const App = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'mentor':
        return <AIMentorBot onBack={() => setActiveTool(null)} />;
      case 'research':
        return <MarketResearchAssistant onBack={() => setActiveTool(null)} />;
      case 'cofounder':
        return <CoFounderSimulator onBack={() => setActiveTool(null)} />;
      default:
        return (
          <AIToolsDashboard
            onSelectTool={(tool) => setActiveTool(tool)}
          />
        );
    }
  };

  return (
    <Layout>
      {renderActiveTool()}
    </Layout>
  );
};

export default App;