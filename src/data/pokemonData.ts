// i love T - Local Pokemon data cache
import { Pokemon } from '../types/pokemon';

export const localPokemonData: Pokemon[] = [
  {
    id: 1,
    name: "bulbasaur",
    types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
    sprites: {
      front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      other: {
        "official-artwork": {
          front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png"
        }
      }
    },
    stats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "attack" } },
      { base_stat: 49, stat: { name: "defense" } },
      { base_stat: 65, stat: { name: "special-attack" } },
      { base_stat: 65, stat: { name: "special-defense" } },
      { base_stat: 45, stat: { name: "speed" } }
    ],
    height: 7,
    weight: 69,
    abilities: [{ ability: { name: "overgrow" } }]
  }
  // Note: This is just an example. We'll fetch and cache more data.
];
