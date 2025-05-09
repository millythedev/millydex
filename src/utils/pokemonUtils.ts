// i love T - Pokemon stat calculation and formatting utilities

export const calculateStatAtLevel = (baseStat: number, level: number, isHP: boolean = false): number => {
  const normalizedLevel = Math.max(1, Math.min(100, level));
  if (isHP) {
    return Math.floor((2 * baseStat * normalizedLevel / 100) + normalizedLevel + 10);
  }
  return Math.floor((2 * baseStat * normalizedLevel / 100) + 5);
};

export const getStatMaxValue = (statName: string): number => {
  // Maximum stats at level 100
  const maxStats: Record<string, number> = {
    hp: 714, // Blissey's max HP at level 100
    attack: 526, // Mega Mewtwo X's max Attack at level 100
    defense: 614, // Mega Steelix's max Defense at level 100
    'special-attack': 535, // Mega Mewtwo Y's max Sp.Atk at level 100
    'special-defense': 614, // Shuckle's max Sp.Def at level 100
    speed: 536 // Deoxys-Speed's max Speed at level 100
  };
  
  return maxStats[statName.toLowerCase()] || 500;
};

export const getStatPercentage = (stat: number, maxValue: number): number => {
  return Math.min((stat / maxValue) * 100, 100);
};

export const getStatColor = (percentage: number): string => {
  if (percentage >= 85) return '#22c55e'; // green-500
  if (percentage >= 70) return '#84cc16'; // lime-500
  if (percentage >= 55) return '#eab308'; // yellow-500
  if (percentage >= 40) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
};

export const formatStatName = (statName: string): string => {
  const statNames: Record<string, string> = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Speed'
  };
  
  return statNames[statName.toLowerCase()] || statName;
};
