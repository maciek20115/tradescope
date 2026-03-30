
import React from 'react';
import { ChartIcon } from './icons/ChartIcon';
import { SparkIcon } from './icons/SparkIcon';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <ChartIcon className="h-8 w-8 text-cyan-400" />
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          TradeScope
        </h1>
      </div>
      <div className="flex items-center space-x-2 text-sm text-cyan-400">
        <SparkIcon className="h-5 w-5" />
        <span>Powered by Gemini</span>
      </div>
    </header>
  );
};
