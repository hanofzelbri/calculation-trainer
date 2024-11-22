import React from 'react';
import Calculator from './components/Calculator';
import { GameProgress } from './components/GameProgress';
import DailyQuests from './components/DailyQuests';
import { StatisticsView } from './components/StatisticsView';
import Settings from './components/Settings';
import { Test } from './components/Test';
import { History } from './components/History';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <GameProgress />
        <DailyQuests />
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="practice">Üben</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
            <TabsTrigger value="history">Verlauf</TabsTrigger>
            <TabsTrigger value="statistics">Statistiken</TabsTrigger>
            <TabsTrigger value="settings">Einstellungen</TabsTrigger>
          </TabsList>
          <TabsContent value="practice">
            <Calculator />
          </TabsContent>
          <TabsContent value="test">
            <Test />
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
        </Tabs>
      </div>
    </div>
  );
};

export default App;
