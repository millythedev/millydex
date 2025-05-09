import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PokemonDetail as PokemonDetailType, PokemonSpecies } from '../types/pokemon';
import { 
  fetchPokemonDetail, 
  fetchPokemonSpecies, 
  getEnglishDescription, 
  formatPokemonId, 
  getTypeColor 
} from '../utils/api';
import {
  calculateStatAtLevel,
  getStatMaxValue,
  getStatPercentage,
  getStatColor,
  formatStatName
} from '../utils/pokemonUtils';
import { X } from 'lucide-react';

interface PokemonDetailProps {
  pokemonId: number;
  onClose: () => void;
}

const PokemonDetail: React.FC<PokemonDetailProps> = ({ pokemonId, onClose }) => {
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(1); // i love T - Starting at level 1

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [pokemonData, speciesData] = await Promise.all([
          fetchPokemonDetail(pokemonId),
          fetchPokemonSpecies(pokemonId)
        ]);
        setPokemon(pokemonData);
        setSpecies(speciesData);
      } catch (err) {
        setError('Failed to load Pokémon details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pokemonId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-64">
            <div className="w-16 h-16 relative animate-spin">
              <div className="w-full h-full rounded-full border-4 border-t-purple-500 border-b-purple-500 border-l-white border-r-white"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pokemon || !species) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error || 'Failed to load Pokémon details'}</p>
          <button 
            className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const description = getEnglishDescription(species);
  const genus = species.genera.find(g => g.language.name === 'en')?.genus || 'Pokémon';

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-4xl w-full mx-auto max-h-[90vh] overflow-y-auto shadow-2xl"
        >
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className={`p-8 rounded-t-2xl bg-gradient-to-br from-purple-500 to-purple-700`}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-48 h-48">
                  <img
                    src={pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white capitalize">
                      {pokemon.name}
                    </h2>
                    <span className="text-2xl font-mono text-white/70">
                      {formatPokemonId(pokemon.id)}
                    </span>
                  </div>
                  
                  <p className="text-white/90 mb-4">{genus}</p>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type.type.name}
                        className={`${getTypeColor(type.type.name)} px-4 py-1 rounded-full text-white font-medium`}
                      >
                        {type.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-b border-gray-100">
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            <div className="px-8 py-4 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold min-w-[60px]">Level:</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <span className="text-purple-600 font-bold w-12 text-center">{level}</span>
              </div>
            </div>

            <div className="px-8 py-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Stats at Level {level}</h3>
              <div className="grid gap-4">
                {pokemon.stats.map((stat) => {
                  const isHP = stat.stat.name.toLowerCase() === 'hp';
                  const calculatedStat = calculateStatAtLevel(stat.base_stat, level, isHP);
                  const maxValue = getStatMaxValue(stat.stat.name);
                  const percentage = getStatPercentage(calculatedStat, maxValue);
                  const color = getStatColor(percentage);
                  
                  return (
                    <div key={stat.stat.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-medium w-24">
                            {formatStatName(stat.stat.name)}
                          </span>
                          <span className="text-gray-400 text-sm">
                            (Base: {stat.base_stat})
                          </span>
                        </div>
                        <span className="font-bold text-lg" style={{ color }}>
                          {calculatedStat}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 rounded-b-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Height</h4>
                  <p className="text-lg font-semibold">{(pokemon.height * 0.1).toFixed(1)}m</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Weight</h4>
                  <p className="text-lg font-semibold">{(pokemon.weight * 0.1).toFixed(1)}kg</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PokemonDetail;