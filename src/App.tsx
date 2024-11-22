import React from 'react';
import Calculator from './components/Calculator';
import { GameProgress } from './components/GameProgress';
import DailyQuests from './components/DailyQuests';
import { StatisticsView } from './components/StatisticsView';
import Settings from './components/Settings';
import { History } from './components/History';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12 px-2 sm:px-4">
      <div className="container mx-auto max-w-2xl">
        <GameProgress />
        <DailyQuests />
        <Tabs defaultValue="practice" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 mb-32 sm:mb-4">
            <TabsTrigger className="h-12 sm:h-10 px-2 py-2 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap" value="practice">Üben</TabsTrigger>
            <TabsTrigger className="h-12 sm:h-10 px-2 py-2 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap" value="history">Verlauf</TabsTrigger>
            <TabsTrigger className="h-12 sm:h-10 px-2 py-2 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap" value="statistics">Statistiken</TabsTrigger>
            <TabsTrigger className="h-12 sm:h-10 px-2 py-2 text-sm sm:text-base whitespace-normal sm:whitespace-nowrap" value="settings">Einstellungen</TabsTrigger>
          </TabsList>
          <div>
            <TabsContent value="practice">
              <Calculator />
            </TabsContent>
            <TabsContent value="history">
              <History />
            </TabsContent>
            <TabsContent value="statistics">
              <StatisticsView />
            </TabsContent>
            <TabsContent value="settings">
              <Settings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default App;
