import React from 'react';
import Calculator from './components/Calculator';
import { StatisticsView } from './components/StatisticsView';
import Settings from './components/Settings';
import { History } from './components/History';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";

const App: React.FC = () => {
  return (
    <div className="container max-w-2xl pb-16 sm:pb-0">
      <Tabs defaultValue="practice" className="w-full">
        <TabsList className="fixed bottom-0 h-18 left-0 right-0 grid w-full grid-cols-4 gap-0 border-t bg-background p-2 sm:relative sm:gap-2 sm:border-none sm:p-0 sm:mb-4 shadow-lg sm:shadow-none sm:bg-transparent">
          <TabsTrigger value="practice" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-blue-500 data-[state=active]:fill-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.75 15.75V18m-6-6v6m-2.25-4.5v4.5m10.5-6v6m4.5-11.25h-21L12 3l10.5 4.5Z"/></svg>
            Üben
          </TabsTrigger>
          <TabsTrigger value="history" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-green-500 data-[state=active]:fill-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
            Verlauf
          </TabsTrigger>
          <TabsTrigger value="statistics" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-purple-500 data-[state=active]:fill-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75Zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625Zm6.75-4.5c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"/></svg>
            Statistik
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col items-center text-xs gap-1 data-[state=active]:text-orange-500 data-[state=active]:fill-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.204-.107-.397.165-.71.505-.78.929l-.15.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.78-.93-.398-.164-.855-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>
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
