import React from 'react';
import Calculator from './components/Calculator';
import { StatisticsView } from './components/StatisticsView';
import Settings from './components/Settings';
import { History } from './components/History';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BarChart, HistoryIcon, Settings2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="container max-w-2xl pb-16 sm:pb-0">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="fixed bottom-0 h-18 left-0 right-0 grid w-full grid-cols-4 gap-0 border-t bg-background p-2 sm:relative sm:gap-2 sm:border-none sm:p-0 sm:mb-4 shadow-lg sm:shadow-none sm:bg-transparent">
          <TabsTrigger value="practice" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-blue-500">
            <Sparkles className="h-4 w-4" />
            Üben
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-green-500">
            <HistoryIcon className="h-4 w-4" />
            Verlauf
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-purple-500">
            <BarChart className="h-4 w-4" />
            Statistik
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-orange-500">
            <Settings2 className="h-4 w-4" />
            Einst.
          </TabsTrigger>
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
  );
};

export default App;
