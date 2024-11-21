import React from 'react';
import Calculator from './components/Calculator';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Schriftliches Addieren Lernen
        </h1>
        <Calculator />
      </div>
    </div>
  );
};

export default App;
