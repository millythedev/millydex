import { Pokemon, PokemonDetail, PokemonSpecies } from '../types/pokemon';

const POKEMON_LIMIT = 386;
const BASE_URL = 'https://pokeapi.co/api/v2';
const GITHUB_FALLBACK_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const DB_NAME = 'PokemonCache';
const DB_VERSION = 1;
const STORE_NAME = 'pokemon';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

// IndexedDB setup
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Reduce data size by removing unnecessary properties
const reduceDataSize = (pokemon: any): Pokemon => {
  return {
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((t: any) => ({
      type: { name: t.type.name }
    })),
    sprites: {
      front_default: pokemon.sprites.front_default,
      other: {
        'official-artwork': {
          front_default: pokemon.sprites.other?.['official-artwork']?.front_default
        }
      }
    },
    stats: pokemon.stats.map((s: any) => ({
      base_stat: s.base_stat,
      stat: { name: s.stat.name }
    })),
    height: pokemon.height,
    weight: pokemon.weight,
    abilities: pokemon.abilities.map((a: any) => ({
      ability: { name: a.ability.name }
    })),
    species: { url: pokemon.species.url }
  };
};

// Cache management with IndexedDB
const loadFromCache = async (): Promise<Pokemon[] | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const data = request.result;
        if (data && data.length > 0 && data[0].timestamp > Date.now() - CACHE_EXPIRY) {
          resolve(data.map(item => item.data));
        } else {
          resolve(null);
        }
      };
    });
  } catch (error) {
    console.warn('Cache read error:', error);
    return null;
  }
};

const saveToCache = async (data: Pokemon[]) => {
  try {
    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Clear existing data
    await new Promise<void>((resolve, reject) => {
      const clearRequest = store.clear();
      clearRequest.onerror = () => reject(clearRequest.error);
      clearRequest.onsuccess = () => resolve();
    });

    // Store new data
    const timestamp = Date.now();
    for (const pokemon of data) {
      store.put({
        id: pokemon.id,
        data: pokemon,
        timestamp
      });
    }

    return new Promise<void>((resolve, reject) => {
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  } catch (error) {
    console.warn('Cache write error:', error);
  }
};

// Fallback image URL generator
const getFallbackImageUrl = (id: number) => {
  return {
    front_default: `${GITHUB_FALLBACK_URL}/${id}.png`,
    other: {
      'official-artwork': {
        front_default: `${GITHUB_FALLBACK_URL}/other/official-artwork/${id}.png`
      }
    }
  };
};

export const fetchAllPokemon = async (): Promise<Pokemon[]> => {
  // First, try to load from cache
  const cachedData = await loadFromCache();
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${POKEMON_LIMIT}`);
    const data = await response.json();
    
    const pokemonDetailsPromises = data.results.map(async (pokemon: any, index: number) => {
      try {
        const id = index + 1;
        const detailResponse = await fetch(`${BASE_URL}/pokemon/${id}`);
        const pokemonData = await detailResponse.json();
        return reduceDataSize(pokemonData);
      } catch (error) {
        return {
          id: index + 1,
          name: pokemon.name,
          types: [],
          sprites: getFallbackImageUrl(index + 1),
          stats: [],
          height: 0,
          weight: 0,
          abilities: [],
          species: { url: `${BASE_URL}/pokemon-species/${index + 1}` }
        };
      }
    });
    
    const results = await Promise.all(pokemonDetailsPromises);
    await saveToCache(results);
    return results;
  } catch (error) {
    console.warn('API error, falling back to basic data');
    return Array.from({ length: POKEMON_LIMIT }, (_, index) => ({
      id: index + 1,
      name: `Pokemon #${index + 1}`,
      types: [],
      sprites: getFallbackImageUrl(index + 1),
      stats: [],
      height: 0,
      weight: 0,
      abilities: [],
      species: { url: `${BASE_URL}/pokemon-species/${index + 1}` }
    }));
  }
};

export const fetchPokemonDetail = async (id: number): Promise<PokemonDetail> => {
  // First check cache
  const cachedData = await loadFromCache();
  if (cachedData) {
    const cached = cachedData.find(p => p.id === id);
    if (cached) return cached as PokemonDetail;
  }

  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    const pokemonData = await response.json();
    return reduceDataSize(pokemonData) as PokemonDetail;
  } catch (error) {
    return {
      id,
      name: `Pokemon #${id}`,
      types: [],
      sprites: getFallbackImageUrl(id),
      stats: [],
      height: 0,
      weight: 0,
      abilities: [],
      species: { url: `${BASE_URL}/pokemon-species/${id}` }
    };
  }
};

export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon-species/${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching species for Pokemon #${id}:`, error);
    throw error;
  }
};

export const getEnglishDescription = (species: PokemonSpecies): string => {
  const englishEntries = species.flavor_text_entries.filter(
    entry => entry.language.name === 'en'
  );
  
  return englishEntries.length > 0 
    ? englishEntries[0].flavor_text.replace(/\f/g, ' ') 
    : 'No description available.';
};

export const formatPokemonId = (id: number): string => {
  return `#${id.toString().padStart(3, '0')}`;
};

// i love T - Type-related utilities
export const getTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };
  
  return typeColors[type] || 'bg-gray-400';
};

export const getAllTypes = () => [
  'all',
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
];