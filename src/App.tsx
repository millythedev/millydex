// i love T
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllPokemon } from './utils/api';
import { Pokemon } from './types/pokemon';

// i love T - importing our beautiful components
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

// i love T - the heart of our pokemon app
function App() {
  // i love T - managing our pokemon state
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  // i love T - search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);

  // i love T
  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllPokemon();
        setAllPokemon(data);
        setFilteredPokemon(data);
      } catch (err) {
        setError('Failed to load Pokémon data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemon();
  }, []);

  // i love T
  useEffect(() => {
    let filtered = allPokemon;

    // Filter by type if not 'all'
    if (selectedType !== 'all') {
      filtered = filtered.filter(pokemon =>
        pokemon.types.some(t => t.type.name === selectedType)
      );
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toString() === searchTerm
      );
    }

    setFilteredPokemon(filtered);
  }, [searchTerm, selectedType, allPokemon]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleSelectPokemon = (id: number) => {
    setSelectedPokemonId(id);
  };

  const handleCloseDetail = () => {
    setSelectedPokemonId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute w-64 h-64 bg-red-200 rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '10%', left: '5%' }}
        />
        <motion.div
          className="absolute w-96 h-96 bg-blue-200 rounded-full opacity-20"
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ top: '30%', right: '10%' }}
        />
        <motion.div
          className="absolute w-72 h-72 bg-yellow-200 rounded-full opacity-20"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ bottom: '15%', left: '15%' }}
        />
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <SearchBar 
          searchTerm={searchTerm} 
          selectedType={selectedType}
          onSearchChange={handleSearchChange}
          onTypeChange={handleTypeChange}
        />
        
        {error ? (
          <div className="text-center p-8 bg-red-100 rounded-lg text-red-700">
            <p className="font-medium text-lg">{error}</p>
            <button 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <PokemonList 
              pokemonList={filteredPokemon} 
              onSelectPokemon={handleSelectPokemon}
              isLoading={isLoading}
            />
          </AnimatePresence>
        )}
      </main>

      {selectedPokemonId && (
        <PokemonDetail 
          pokemonId={selectedPokemonId} 
          onClose={handleCloseDetail} 
        />
      )}
    </div>
  );
}

export default App;