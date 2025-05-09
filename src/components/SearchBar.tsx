import React from 'react';
import { Search } from 'lucide-react';
import { getAllTypes } from '../utils/api';
import { motion } from 'framer-motion';

interface SearchBarProps {
  searchTerm: string;
  selectedType: string;
  onSearchChange: (value: string) => void;
  onTypeChange: (type: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  selectedType,
  onSearchChange,
  onTypeChange
}) => {
  const types = getAllTypes();

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-purple-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-11 pr-3 py-4 border-2 border-purple-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200"
          placeholder="Search Pokémon by name..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            onClick={() => onSearchChange('')}
          >
            <span className="sr-only">Clear search</span>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      
      <motion.div 
        className="flex flex-wrap gap-2 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {types.map((type, index) => (
          <motion.button
            key={type}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTypeChange(type)}
            className={`px-6 py-2 rounded-xl capitalize transition-all duration-200 font-medium ${
              selectedType === type
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white hover:shadow-md'
            }`}
          >
            {type}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default SearchBar;