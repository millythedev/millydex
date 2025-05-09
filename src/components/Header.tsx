import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <Sparkles size={32} className="text-yellow-300 animate-pulse" />
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-400">
              Milly's Pokédex
            </h1>
            <p className="text-sm md:text-base text-yellow-100 mt-1 font-medium">
              Exploring Gen 1-3 • 386 Pokémon
            </p>
          </div>
          <Sparkles size={32} className="text-yellow-300 animate-pulse" />
        </div>
      </div>
    </header>
  );
};

export default Header;