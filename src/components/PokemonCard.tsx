import React from 'react';
import { motion } from 'framer-motion';
import { Pokemon } from '../types/pokemon';
import { formatPokemonId, getTypeColor, capitalizeFirstLetter } from '../utils/api';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4 pb-2 bg-gradient-to-b from-purple-50 to-transparent">
        <motion.img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-full h-32 object-contain"
          loading="lazy"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="p-4 pt-2">
        <div className="text-purple-500 text-sm font-mono mb-1">
          {formatPokemonId(pokemon.id)}
        </div>
        <h3 className="text-lg font-bold capitalize mb-2 text-gray-800">
          {pokemon.name}
        </h3>
        <div className="flex gap-2">
          {pokemon.types.map(typeInfo => (
            <span 
              key={typeInfo.type.name}
              className={`${getTypeColor(typeInfo.type.name)} text-white text-xs px-3 py-1 rounded-full capitalize font-medium shadow-sm`}
            >
              {typeInfo.type.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PokemonCard;