export interface AquariumImage {
  id: string;
  title?: string;
  url: string;
  date: string;
  description: string;
  analysis?: boolean;
  aquariumId: string;
}

export interface AquariumSettings {
  showTemperature: boolean;
}

export interface Aquarium {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  settings?: AquariumSettings;
}

export interface GlobalSettings {
  webhookUrl?: string;
}