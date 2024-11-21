import React from 'react';
import Calculator from '@/components/Calculator';
import { GameProgress } from './components/GameProgress';
import DailyQuests from './components/DailyQuests';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <GameProgress />
        <DailyQuests />
        <Calculator />
      </div>
    </div>
  );
};

export default App;
