import React from 'react';
import { motion } from 'framer-motion';
import { Pokemon } from '../types/pokemon';
import PokemonCard from './PokemonCard';

interface PokemonListProps {
  pokemonList: Pokemon[];
  onSelectPokemon: (id: number) => void;
  isLoading: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

const PokemonList: React.FC<PokemonListProps> = ({ 
  pokemonList, 
  onSelectPokemon,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="w-16 h-16 relative animate-spin">
          <div className="w-full h-full rounded-full border-4 border-t-red-500 border-b-red-500 border-l-white border-r-white"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Loading Pokémon...</p>
      </div>
    );
  }

  if (pokemonList.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-gray-700">No Pokémon found</h3>
        <p className="text-gray-500 mt-2">Try a different search term or type filter</p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
    >
      {pokemonList.map((pokemon) => (
        <motion.div key={pokemon.id} variants={item}>
          <PokemonCard
            pokemon={pokemon}
            onClick={() => onSelectPokemon(pokemon.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default PokemonList;