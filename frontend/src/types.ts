export interface EcosystemHistory {
  date: string;
  stats: EcosystemStats;
}

export interface AquariumStats {
  volume: string;
  temperature: string;
  lastChecked: string;
  ammonia: string;
  nitrate: string;
  nitrite: string;
  hardness: string;
  co2: string;
  humidity: string;
}

export interface TerrariumStats {
  volume: string;
  temperature: string;
  lastChecked: string;
  humidity: string;
  light: string;
  soilMoisture: string;
}

export interface Ecosystem {
  id: string;
  name: string;
  type: string;
  volume: string;
  lastChecked: string;
}

export interface EcosystemStats {
  volume: string;
  temperature: string;
  lastChecked: string;
  ammonia?: string;
  nitrate?: string;
  nitrite?: string;
  hardness?: string;
  co2?: string;
  humidity: string;
  light?: string;
  soilMoisture?: string;
}
